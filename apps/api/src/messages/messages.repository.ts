import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { BaseRepository } from '../database/base.repository';
import { DATABASE_POOL } from '../database/database.module';

@Injectable()
export class MessagesRepository extends BaseRepository {
  constructor(@Inject(DATABASE_POOL) pool: Pool) {
    super(pool, 'MessagesRepository');
  }

  async findByPatient(
    patientId: string,
    params: { page: number; perPage: number; threadId?: string },
  ) {
    const conditions = ['m.patient_id = $1'];
    const queryParams: any[] = [patientId];
    if (params.threadId) {
      queryParams.push(params.threadId);
      conditions.push(`m.thread_id = $${queryParams.length}`);
    }

    const countResult = await this.query(
      `SELECT COUNT(*)::int AS total FROM messages m WHERE ${conditions.join(' AND ')}`,
      queryParams,
    );

    const offset = (params.page - 1) * params.perPage;
    queryParams.push(params.perPage, offset);
    const result = await this.query(
      `SELECT m.*,
              u.name AS sender_name, u.type AS sender_type
       FROM messages m
       JOIN users u ON u.id = m.sender_id
       WHERE ${conditions.join(' AND ')}
       ORDER BY m.created_at DESC
       LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`,
      queryParams,
    );

    return {
      data: result.rows,
      pagination: this.buildPagination(
        countResult.rows[0].total,
        params.page,
        params.perPage,
      ),
    };
  }

  async findByRecipient(
    userId: string,
    params: { page: number; perPage: number; unreadOnly?: boolean },
  ) {
    const conditions = ['m.recipient_id = $1'];
    const queryParams: any[] = [userId];
    if (params.unreadOnly) {
      conditions.push('m.is_read = FALSE');
    }

    const countResult = await this.query(
      `SELECT COUNT(*)::int AS total FROM messages m WHERE ${conditions.join(' AND ')}`,
      queryParams,
    );

    const offset = (params.page - 1) * params.perPage;
    queryParams.push(params.perPage, offset);
    const result = await this.query(
      `SELECT m.*,
              u.name AS sender_name, u.type AS sender_type
       FROM messages m
       JOIN users u ON u.id = m.sender_id
       WHERE ${conditions.join(' AND ')}
       ORDER BY m.created_at DESC
       LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`,
      queryParams,
    );

    return {
      data: result.rows,
      pagination: this.buildPagination(
        countResult.rows[0].total,
        params.page,
        params.perPage,
      ),
    };
  }

  async create(data: Record<string, any>) {
    return this.queryOne(
      `INSERT INTO messages (sender_id, recipient_id, patient_id, thread_id, content, message_type, media_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        data.sender_id,
        data.recipient_id || null,
        data.patient_id,
        data.thread_id || null,
        data.content || null,
        data.message_type || 'text',
        data.media_url || null,
      ],
    );
  }

  async markRead(messageId: string) {
    return this.queryOne(
      `UPDATE messages SET is_read = TRUE, read_at = NOW()
       WHERE id = $1 RETURNING *`,
      [messageId],
    );
  }

  async markAllReadForPatient(userId: string, patientId: string) {
    const result = await this.query(
      `UPDATE messages SET is_read = TRUE, read_at = NOW()
       WHERE recipient_id = $1 AND patient_id = $2 AND is_read = FALSE
       RETURNING id`,
      [userId, patientId],
    );
    return result.rowCount;
  }

  async getUnreadCount(userId: string) {
    const result = await this.queryOne<{ count: number }>(
      `SELECT COUNT(*)::int AS count FROM messages
       WHERE recipient_id = $1 AND is_read = FALSE`,
      [userId],
    );
    return result?.count || 0;
  }

  async getThreads(patientId: string) {
    const result = await this.query(
      `SELECT DISTINCT ON (COALESCE(m.thread_id, m.id))
              COALESCE(m.thread_id, m.id) AS thread_id,
              m.content AS last_message,
              m.message_type AS last_type,
              m.created_at AS last_at,
              m.sender_id,
              u.name AS sender_name,
              (SELECT COUNT(*) FROM messages m2
               WHERE COALESCE(m2.thread_id, m2.id) = COALESCE(m.thread_id, m.id)
                 AND m2.is_read = FALSE)::int AS unread_count
       FROM messages m
       JOIN users u ON u.id = m.sender_id
       WHERE m.patient_id = $1
       ORDER BY COALESCE(m.thread_id, m.id), m.created_at DESC`,
      [patientId],
    );
    return result.rows;
  }
}
