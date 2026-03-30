import { Module, Global, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

const redisFactory = {
  provide: REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const logger = new Logger('RedisModule');

    const client = new Redis({
      host: config.get('REDIS_HOST', 'localhost'),
      port: config.get<number>('REDIS_PORT', 6379),
      password: config.get('REDIS_PASSWORD') || undefined,
      db: config.get<number>('REDIS_DB', 0),
      tls: config.get('REDIS_TLS') === 'true' ? {} : undefined,
      keyPrefix: config.get('REDIS_KEY_PREFIX', 'pallicare:'),
      retryStrategy: (times) => Math.min(times * 200, 5000),
      maxRetriesPerRequest: 3,
    });

    client.on('connect', () => logger.log('Redis connected'));
    client.on('error', (err) => logger.error('Redis error', err.message));

    return client;
  },
};

@Global()
@Module({
  providers: [redisFactory],
  exports: [redisFactory],
})
export class RedisModule {}
