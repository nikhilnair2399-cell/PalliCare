import { Controller, Get, Inject } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthCheckResult,
} from '@nestjs/terminus';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../database/database.module';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    @Inject(DATABASE_POOL) private readonly pool: Pool,
  ) {}

  @Get('health')
  @HealthCheck()
  @ApiOperation({ summary: 'Service health check' })
  async check(): Promise<HealthCheckResult> {
    return this.health.check([
      // Database check
      async () => {
        try {
          const result = await this.pool.query('SELECT 1');
          return {
            database: {
              status: 'up' as const,
              message: 'PostgreSQL connected',
            },
          };
        } catch {
          return {
            database: {
              status: 'down' as const,
              message: 'PostgreSQL unreachable',
            },
          };
        }
      },
    ]);
  }

  @Get('health/ready')
  @ApiOperation({ summary: 'Readiness probe' })
  async ready() {
    try {
      await this.pool.query('SELECT 1');
      return { status: 'ready', timestamp: new Date().toISOString() };
    } catch {
      return { status: 'not_ready', timestamp: new Date().toISOString() };
    }
  }
}
