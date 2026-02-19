import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('PalliCare API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('/api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ─── Health ─────────────────────────────────────────────────
  describe('Health', () => {
    it('GET /api/v1/health should return healthy status', () => {
      return request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBeDefined();
        });
    });

    it('GET /api/v1/health/ready should return readiness', () => {
      return request(app.getHttpServer())
        .get('/api/v1/health/ready')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBeDefined();
        });
    });
  });

  // ─── Auth ───────────────────────────────────────────────────
  describe('Auth', () => {
    it('POST /api/v1/auth/otp/request should accept valid Indian phone', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/otp/request')
        .send({ phone: '+919876543210' })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.message).toBe('OTP sent successfully');
          expect(res.body.data.expires_in).toBeDefined();
        });
    });

    it('POST /api/v1/auth/otp/request should reject invalid phone', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/otp/request')
        .send({ phone: '12345' })
        .expect(400);
    });

    it('POST /api/v1/auth/otp/verify should reject invalid OTP', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/otp/verify')
        .send({ phone: '+919876543210', otp: '999999' })
        .expect(401);
    });

    it('POST /api/v1/auth/otp/verify should accept dev bypass OTP 000000', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/otp/verify')
        .send({ phone: '+919876543210', otp: '000000' })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.access_token).toBeDefined();
          expect(res.body.data.refresh_token).toBeDefined();
          expect(res.body.data.user).toBeDefined();
          expect(res.body.data.token_type).toBe('bearer');
        });
    });
  });

  // ─── Protected Routes ──────────────────────────────────────
  describe('Protected routes', () => {
    it('GET /api/v1/clinician/patients should require auth', () => {
      return request(app.getHttpServer())
        .get('/api/v1/clinician/patients')
        .expect(401);
    });

    it('GET /api/v1/clinical-alerts should require auth', () => {
      return request(app.getHttpServer())
        .get('/api/v1/clinical-alerts')
        .expect(401);
    });

    it('GET /api/v1/analytics/department-summary should require auth', () => {
      return request(app.getHttpServer())
        .get('/api/v1/analytics/department-summary')
        .expect(401);
    });

    it('GET /api/v1/notifications should require auth', () => {
      return request(app.getHttpServer())
        .get('/api/v1/notifications')
        .expect(401);
    });

    it('POST /api/v1/sync should require auth', () => {
      return request(app.getHttpServer())
        .post('/api/v1/sync')
        .send({ device_id: 'test', records: [] })
        .expect(401);
    });
  });
});
