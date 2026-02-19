import { Inject, Logger } from '@nestjs/common';
import { Pool, QueryResult, QueryResultRow } from 'pg';
import { DATABASE_POOL } from './database.module';

/**
 * Base repository providing thin wrapper over pg Pool for
 * parameterised queries, transactions, and pagination.
 */
export abstract class BaseRepository {
  protected readonly logger: Logger;

  constructor(
    @Inject(DATABASE_POOL) protected readonly pool: Pool,
    context: string,
  ) {
    this.logger = new Logger(context);
  }

  /** Run a single parameterised query */
  protected async query<T extends QueryResultRow = any>(
    sql: string,
    params: any[] = [],
  ): Promise<QueryResult<T>> {
    const start = Date.now();
    try {
      const result = await this.pool.query<T>(sql, params);
      const duration = Date.now() - start;
      if (duration > 200) {
        this.logger.warn(`Slow query (${duration}ms): ${sql.slice(0, 120)}`);
      }
      return result;
    } catch (err) {
      this.logger.error(`Query failed: ${sql.slice(0, 120)}`, err);
      throw err;
    }
  }

  /** Run a query expecting a single row (or null) */
  protected async queryOne<T extends QueryResultRow = any>(
    sql: string,
    params: any[] = [],
  ): Promise<T | null> {
    const result = await this.query<T>(sql, params);
    return result.rows[0] ?? null;
  }

  /** Run a query expecting exactly one row (throws if 0) */
  protected async queryOneOrFail<T extends QueryResultRow = any>(
    sql: string,
    params: any[] = [],
  ): Promise<T> {
    const row = await this.queryOne<T>(sql, params);
    if (!row) {
      throw new Error('Expected row not found');
    }
    return row;
  }

  /** Execute within a transaction */
  protected async transaction<T>(
    fn: (client: import('pg').PoolClient) => Promise<T>,
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /** Build paginated response */
  protected buildPagination(total: number, page: number, perPage: number) {
    return {
      total,
      page,
      per_page: perPage,
      total_pages: Math.ceil(total / perPage),
    };
  }
}
