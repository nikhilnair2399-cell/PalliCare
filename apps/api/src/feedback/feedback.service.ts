import { Injectable, Inject, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../database/database.module';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  private readonly logger = new Logger('FeedbackService');

  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  /**
   * Save a feedback entry submitted from the mobile app.
   */
  async create(userId: string, dto: CreateFeedbackDto) {
    const sql = `
      INSERT INTO feedback (user_id, screen, rating, category, text, client_timestamp)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, screen, rating, category, text, client_timestamp, created_at
    `;
    const params = [
      userId,
      dto.screen,
      dto.rating,
      dto.category ?? 'general',
      dto.text ?? null,
      dto.timestamp ? new Date(dto.timestamp) : null,
    ];

    const result = await this.pool.query(sql, params);
    this.logger.log(`Feedback created: ${result.rows[0].id} by user ${userId}`);
    return result.rows[0];
  }

  /**
   * List feedback entries with optional filters and pagination.
   * Admin-only endpoint for reviewing pilot feedback.
   */
  async list(filters: {
    screen?: string;
    minRating?: number;
    maxRating?: number;
    page?: number;
    perPage?: number;
  }) {
    const { screen, minRating, maxRating, page = 1, perPage = 20 } = filters;
    const offset = (page - 1) * perPage;
    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (screen) {
      conditions.push(`f.screen = $${paramIndex}`);
      values.push(screen);
      paramIndex++;
    }

    if (minRating !== undefined) {
      conditions.push(`f.rating >= $${paramIndex}`);
      values.push(minRating);
      paramIndex++;
    }

    if (maxRating !== undefined) {
      conditions.push(`f.rating <= $${paramIndex}`);
      values.push(maxRating);
      paramIndex++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count total
    const countSql = `SELECT COUNT(*)::int AS total FROM feedback f ${whereClause}`;
    const countResult = await this.pool.query(countSql, values);
    const total = countResult.rows[0].total;

    // Fetch page
    const dataSql = `
      SELECT
        f.id,
        f.user_id,
        u.name AS user_name,
        u.type AS user_type,
        f.screen,
        f.rating,
        f.category,
        f.text,
        f.client_timestamp,
        f.created_at
      FROM feedback f
      LEFT JOIN users u ON u.id = f.user_id
      ${whereClause}
      ORDER BY f.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const dataResult = await this.pool.query(dataSql, [
      ...values,
      perPage,
      offset,
    ]);

    return {
      data: dataResult.rows,
      pagination: {
        total,
        page,
        per_page: perPage,
        total_pages: Math.ceil(total / perPage),
      },
    };
  }
}
