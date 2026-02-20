import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { BaseRepository } from '../database/base.repository';
import { DATABASE_POOL } from '../database/database.module';

@Injectable()
export class MedicationDbRepository extends BaseRepository {
  constructor(@Inject(DATABASE_POOL) pool: Pool) {
    super(pool, 'MedicationDbRepository');
  }

  async search(query: string, limit: number = 20) {
    const result = await this.query(
      `SELECT *,
              ts_rank(search_vector, plainto_tsquery('english', $1)) AS relevance
       FROM medication_database
       WHERE search_vector @@ plainto_tsquery('english', $1)
          OR generic_name ILIKE $2
          OR $1 = ANY(brand_names)
       ORDER BY relevance DESC NULLS LAST, generic_name
       LIMIT $3`,
      [query, `%${query}%`, limit],
    );
    return result.rows;
  }

  async findById(id: string) {
    return this.queryOne(
      `SELECT * FROM medication_database WHERE id = $1`,
      [id],
    );
  }

  async findByCategory(category: string) {
    const result = await this.query(
      `SELECT * FROM medication_database
       WHERE category = $1
       ORDER BY generic_name`,
      [category],
    );
    return result.rows;
  }

  async findPalliativeOnly() {
    const result = await this.query(
      `SELECT * FROM medication_database
       WHERE palliative_use = TRUE
       ORDER BY category, generic_name`,
      [],
    );
    return result.rows;
  }

  async findOpioids() {
    const result = await this.query(
      `SELECT * FROM medication_database
       WHERE category = 'opioid' AND medd_factor IS NOT NULL
       ORDER BY generic_name`,
      [],
    );
    return result.rows;
  }
}
