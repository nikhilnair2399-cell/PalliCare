import { Controller, Get, Inject } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthCheckResult,
} from '@nestjs/terminus';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../database/database.module';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class HealthController {
  private readonly startTime = Date.now();

  constructor(
    private health: HealthCheckService,
    @Inject(DATABASE_POOL) private readonly pool: Pool,
  ) {}

  @Get('health')
  @HealthCheck()
  @ApiOperation({ summary: 'Service health check with dependency status' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  @ApiResponse({ status: 503, description: 'Service is unhealthy' })
  async check(): Promise<HealthCheckResult> {
    return this.health.check([
      // Database check
      async () => {
        try {
          const result = await this.pool.query(
            "SELECT version(), current_database(), pg_size_pretty(pg_database_size(current_database())) as db_size",
          );
          const row = result.rows[0];
          return {
            database: {
              status: 'up' as const,
              version: row.version?.split(',')[0] || 'PostgreSQL',
              database: row.current_database,
              size: row.db_size,
            },
          };
        } catch (err) {
          return {
            database: {
              status: 'down' as const,
              message: 'PostgreSQL unreachable',
            },
          };
        }
      },
      // TimescaleDB check
      async () => {
        try {
          const result = await this.pool.query(
            "SELECT extversion FROM pg_extension WHERE extname = 'timescaledb'",
          );
          return {
            timescaledb: {
              status: (result.rows.length > 0 ? 'up' : 'down') as 'up' | 'down',
              version: result.rows[0]?.extversion || 'not installed',
            },
          };
        } catch {
          return {
            timescaledb: {
              status: 'down' as const,
              message: 'Check failed',
            },
          };
        }
      },
    ]);
  }

  @Get('health/ready')
  @ApiOperation({ summary: 'Readiness probe for container orchestration' })
  @ApiResponse({ status: 200, description: 'Service is ready to accept traffic' })
  async ready() {
    try {
      await this.pool.query('SELECT 1');
      return {
        status: 'ready',
        timestamp: new Date().toISOString(),
        uptime: Math.floor((Date.now() - this.startTime) / 1000),
      };
    } catch {
      return {
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        uptime: Math.floor((Date.now() - this.startTime) / 1000),
      };
    }
  }

  @Get('health/info')
  @ApiOperation({ summary: 'Application version and build info' })
  async info() {
    return {
      app: 'PalliCare API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      node: process.version,
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      timestamp: new Date().toISOString(),
      features: {
        voice_input: process.env.FEATURE_VOICE_INPUT === 'true',
        caregiver_mode: process.env.FEATURE_CAREGIVER_MODE !== 'false',
        offline_sync: process.env.FEATURE_OFFLINE_SYNC !== 'false',
        abha_linking: process.env.FEATURE_ABHA_LINKING === 'true',
        fhir_export: process.env.FEATURE_FHIR_EXPORT === 'true',
      },
    };
  }
}
