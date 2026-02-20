import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT', 3001);
  const prefix = configService.get<string>('API_PREFIX', '/api/v1');

  // Global prefix
  app.setGlobalPrefix(prefix);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: configService
      .get<string>(
        'CORS_ORIGINS',
        'http://localhost:3000,http://localhost:3005,http://localhost:3008',
      )
      .split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global filters & interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger (non-production only)
  if (configService.get('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('PalliCare API')
      .setDescription(
        'AIIMS Bhopal Palliative Care & Pain Management Platform API',
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token',
        },
        'access-token',
      )
      .addTag('auth', 'OTP-based authentication')
      .addTag('patients', 'Patient data management')
      .addTag('medications', 'Medication tracking & MEDD')
      .addTag('clinical-alerts', 'Clinical alert system')
      .addTag('clinical-notes', 'Clinical documentation (SOAP, SBAR, progress)')
      .addTag('care-plans', 'Versioned care plans with goals & interventions')
      .addTag('caregivers', 'Caregiver management, schedules & handover')
      .addTag('messages', 'Care team communication threads')
      .addTag('wellness', 'Goals, gratitude, intentions, milestones')
      .addTag('education', 'Learn modules & breathe sessions')
      .addTag('medication-database', 'Drug reference with MEDD conversion')
      .addTag('consent', 'DPDPA 2023 consent management')
      .addTag('uploads', 'S3/MinIO pre-signed URL generation')
      .addTag('devices', 'FCM/APNS push token registration')
      .addTag('notifications', 'Push & in-app notifications')
      .addTag('analytics', 'Department analytics & quality metrics')
      .addTag('sync', 'Offline data synchronisation')
      .addTag('health', 'Service health & readiness checks')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
    logger.log(`Swagger docs at http://localhost:${port}/docs`);
  }

  await app.listen(port, '0.0.0.0');
  logger.log(`PalliCare API running on port ${port}`);
  logger.log(`API prefix: ${prefix}`);
}

bootstrap();
