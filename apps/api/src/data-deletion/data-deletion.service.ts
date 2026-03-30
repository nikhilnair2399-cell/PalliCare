import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../database/database.module';
import { BaseRepository } from '../database/base.repository';

@Injectable()
export class DataDeletionService extends BaseRepository {
  constructor(@Inject(DATABASE_POOL) pool: Pool) {
    super(pool, 'DataDeletionService');
  }

  /**
   * Create a new data deletion request.
   */
  async requestDeletion(
    userId: string,
    requestType: 'full_erasure' | 'anonymization' | 'selective',
    categories?: string[],
  ) {
    const row = await this.queryOneOrFail(
      `INSERT INTO data_deletion_requests
         (user_id, request_type, categories, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING id, user_id, request_type, categories, status, created_at`,
      [userId, requestType, categories ? JSON.stringify(categories) : null],
    );

    return row;
  }

  /**
   * List deletion requests for a user.
   */
  async listRequests(userId: string) {
    const result = await this.query(
      `SELECT id, request_type, categories, status, created_at, processed_at, notes
       FROM data_deletion_requests
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId],
    );
    return result.rows;
  }

  /**
   * Process a deletion request (admin workflow).
   *
   * Handles:
   * - Clinical Establishments Act retention (3-year minimum for clinical records)
   * - Anonymization of research data
   * - Cascade deletion of non-exempt data
   */
  async processDeletion(requestId: string) {
    const request = await this.queryOne(
      `SELECT id, user_id, request_type, categories, status
       FROM data_deletion_requests
       WHERE id = $1`,
      [requestId],
    );

    if (!request) {
      throw new NotFoundException('Deletion request not found');
    }

    const { user_id, request_type, categories } = request;

    await this.transaction(async (client) => {
      // Mark as processing
      await client.query(
        `UPDATE data_deletion_requests SET status = 'processing' WHERE id = $1`,
        [requestId],
      );

      // Identify patient records for the user
      const patientResult = await client.query(
        `SELECT id, created_at FROM patients WHERE user_id = $1`,
        [user_id],
      );
      const patientIds = patientResult.rows.map((r) => r.id);

      if (patientIds.length === 0) {
        // No patient records — mark completed
        await client.query(
          `UPDATE data_deletion_requests
           SET status = 'completed', processed_at = NOW(),
               notes = 'No patient records found for user.'
           WHERE id = $1`,
          [requestId],
        );
        return;
      }

      const retentionNotes: string[] = [];
      const parsedCategories: string[] | null = categories
        ? JSON.parse(categories)
        : null;

      // Clinical Establishments Act — 3 year minimum for clinical records
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

      const shouldProcess = (category: string) =>
        request_type === 'full_erasure' ||
        (request_type === 'selective' &&
          parsedCategories?.includes(category));

      // Process symptom_logs
      if (shouldProcess('symptom_logs')) {
        const deletable = await client.query(
          `DELETE FROM symptom_logs
           WHERE patient_id = ANY($1) AND recorded_at < $2
           RETURNING id`,
          [patientIds, threeYearsAgo],
        );
        retentionNotes.push(
          `Deleted ${deletable.rowCount} symptom logs older than 3 years.`,
        );

        const retained = await client.query(
          `SELECT COUNT(*)::int AS count FROM symptom_logs
           WHERE patient_id = ANY($1) AND recorded_at >= $2`,
          [patientIds, threeYearsAgo],
        );
        if (retained.rows[0].count > 0) {
          retentionNotes.push(
            `Retained ${retained.rows[0].count} symptom logs (Clinical Establishments Act — 3yr retention).`,
          );
        }
      }

      // Process medications
      if (shouldProcess('medications')) {
        const deletable = await client.query(
          `DELETE FROM medications
           WHERE patient_id = ANY($1) AND created_at < $2
           RETURNING id`,
          [patientIds, threeYearsAgo],
        );
        retentionNotes.push(
          `Deleted ${deletable.rowCount} medication records older than 3 years.`,
        );
      }

      // Process care_plans
      if (shouldProcess('care_plans')) {
        const deletable = await client.query(
          `DELETE FROM care_plans
           WHERE patient_id = ANY($1) AND created_at < $2
           RETURNING id`,
          [patientIds, threeYearsAgo],
        );
        retentionNotes.push(
          `Deleted ${deletable.rowCount} care plans older than 3 years.`,
        );
      }

      // Anonymization for research data
      if (request_type === 'anonymization' || request_type === 'full_erasure') {
        await client.query(
          `UPDATE patients
           SET name = 'ANONYMIZED',
               phone = NULL,
               email = NULL,
               address = NULL,
               emergency_contact_name = NULL,
               emergency_contact_phone = NULL
           WHERE user_id = $1`,
          [user_id],
        );
        retentionNotes.push('Patient profile anonymized.');
      }

      // Full erasure: cascade delete non-exempt, non-retained data
      if (request_type === 'full_erasure') {
        // Delete user-level non-clinical data (feedback, notifications, etc.)
        await client.query(
          `DELETE FROM feedback WHERE user_id = $1`,
          [user_id],
        );
        await client.query(
          `DELETE FROM consents WHERE user_id = $1`,
          [user_id],
        );
        retentionNotes.push(
          'Non-clinical user data (feedback, consents) deleted.',
        );
      }

      // Mark completed
      await client.query(
        `UPDATE data_deletion_requests
         SET status = 'completed', processed_at = NOW(), notes = $1
         WHERE id = $2`,
        [retentionNotes.join(' '), requestId],
      );
    });

    this.logger.log(`Deletion request ${requestId} processed for user ${user_id}`);

    return this.queryOneOrFail(
      `SELECT id, request_type, categories, status, notes, processed_at
       FROM data_deletion_requests
       WHERE id = $1`,
      [requestId],
    );
  }
}
