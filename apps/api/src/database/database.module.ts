import { Module, Global, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

export const DATABASE_POOL = 'DATABASE_POOL';

const databasePoolFactory = {
  provide: DATABASE_POOL,
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const logger = new Logger('DatabaseModule');

    const pool = new Pool({
      host: config.get('DB_HOST', 'localhost'),
      port: config.get<number>('DB_PORT', 5432),
      database: config.get('DB_NAME', 'pallicare'),
      user: config.get('DB_USERNAME', 'pallicare_user'),
      password: config.get('DB_PASSWORD', ''),
      ssl: config.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
      min: config.get<number>('DB_POOL_MIN', 2),
      max: config.get<number>('DB_POOL_MAX', 20),
      connectionTimeoutMillis: config.get<number>('DB_CONNECTION_TIMEOUT', 10_000),
      idleTimeoutMillis: 30_000,
    });

    pool.on('error', (err) => {
      logger.error('Unexpected pool error', err.stack);
    });

    // Verify connection
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT NOW() as now, version()');
      logger.log(
        `Database connected: ${result.rows[0].now} | ${result.rows[0].version.split(',')[0]}`,
      );
      client.release();
    } catch (err) {
      logger.error('Failed to connect to database', err);
    }

    return pool;
  },
};

@Global()
@Module({
  providers: [databasePoolFactory],
  exports: [databasePoolFactory],
})
export class DatabaseModule {}
