import { Injectable, Inject, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../database/database.module';
import { BaseRepository } from '../database/base.repository';

@Injectable()
export class DataPortabilityService extends BaseRepository {
  constructor(@Inject(DATABASE_POOL) pool: Pool) {
    super(pool, 'DataPortabilityService');
  }

  /**
   * Insert a new export request and kick off async processing.
   */
  async requestExport(
    userId: string,
    exportType: 'full' | 'symptom_logs' | 'medications' | 'care_plans',
    format: 'json' | 'csv',
  ) {
    const row = await this.queryOneOrFail(
      `INSERT INTO data_exports (user_id, export_type, format, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING id, user_id, export_type, format, status, created_at`,
      [userId, exportType, format],
    );

    // Fire-and-forget async processing
    this.processExport(row.id).catch((err) =>
      this.logger.error(`Export processing failed for ${row.id}`, err),
    );

    return row;
  }

  /**
   * List all exports for a user, newest first.
   */
  async listExports(userId: string) {
    const result = await this.query(
      `SELECT id, export_type, format, status, file_url, created_at, completed_at
       FROM data_exports
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId],
    );
    return result.rows;
  }

  /**
   * Verify ownership, check completion, return download URL.
   */
  async getExportDownload(userId: string, exportId: string) {
    const row = await this.queryOne(
      `SELECT id, user_id, status, file_url
       FROM data_exports
       WHERE id = $1`,
      [exportId],
    );

    if (!row) {
      throw new NotFoundException('Export not found');
    }

    if (row.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (row.status !== 'completed' || !row.file_url) {
      throw new NotFoundException(
        'Export is not yet completed. Current status: ' + row.status,
      );
    }

    return { file_url: row.file_url };
  }

  /**
   * Async export processing: gather data, build file, update record.
   */
  async processExport(exportId: string) {
    const exportRow = await this.queryOneOrFail(
      `SELECT id, user_id, export_type, format FROM data_exports WHERE id = $1`,
      [exportId],
    );

    const { user_id, export_type, format } = exportRow;

    try {
      // Mark processing
      await this.query(
        `UPDATE data_exports SET status = 'processing' WHERE id = $1`,
        [exportId],
      );

      // Gather data based on export type
      const data: Record<string, any> = {};

      if (export_type === 'full' || export_type === 'symptom_logs') {
        const logs = await this.query(
          `SELECT * FROM symptom_logs WHERE patient_id IN (
             SELECT id FROM patients WHERE user_id = $1
           ) ORDER BY recorded_at DESC`,
          [user_id],
        );
        data.symptom_logs = logs.rows;
      }

      if (export_type === 'full' || export_type === 'medications') {
        const meds = await this.query(
          `SELECT * FROM medications WHERE patient_id IN (
             SELECT id FROM patients WHERE user_id = $1
           ) ORDER BY created_at DESC`,
          [user_id],
        );
        data.medications = meds.rows;
      }

      if (export_type === 'full' || export_type === 'care_plans') {
        const plans = await this.query(
          `SELECT * FROM care_plans WHERE patient_id IN (
             SELECT id FROM patients WHERE user_id = $1
           ) ORDER BY created_at DESC`,
          [user_id],
        );
        data.care_plans = plans.rows;
      }

      if (export_type === 'full') {
        const patients = await this.query(
          `SELECT * FROM patients WHERE user_id = $1`,
          [user_id],
        );
        data.patients = patients.rows;
      }

      // Build file content (JSON or CSV)
      let fileContent: string;

      if (format === 'json') {
        fileContent = JSON.stringify(data, null, 2);
      } else {
        // CSV: flatten all data categories into separate sections
        const sections: string[] = [];
        for (const [category, rows] of Object.entries(data)) {
          if (Array.isArray(rows) && rows.length > 0) {
            const headers = Object.keys(rows[0]);
            const csvRows = rows.map((r: any) =>
              headers.map((h) => JSON.stringify(r[h] ?? '')).join(','),
            );
            sections.push(
              `--- ${category} ---\n${headers.join(',')}\n${csvRows.join('\n')}`,
            );
          }
        }
        fileContent = sections.join('\n\n');
      }

      // In production this would upload to S3/GCS and return a signed URL.
      // For now, store a reference indicating the export is ready.
      const fileUrl = `exports/${user_id}/${exportId}.${format}`;

      await this.query(
        `UPDATE data_exports
         SET status = 'completed', file_url = $1, completed_at = NOW()
         WHERE id = $2`,
        [fileUrl, exportId],
      );

      this.logger.log(`Export ${exportId} completed for user ${user_id}`);
    } catch (err) {
      await this.query(
        `UPDATE data_exports SET status = 'failed' WHERE id = $1`,
        [exportId],
      );
      throw err;
    }
  }
}
