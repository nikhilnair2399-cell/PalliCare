import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { MedicationsModule } from './medications/medications.module';
import { ClinicalAlertsModule } from './clinical-alerts/clinical-alerts.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SyncModule } from './sync/sync.module';
import { GatewayModule } from './gateway/gateway.module';
import { WellnessModule } from './wellness/wellness.module';
import { EducationModule } from './education/education.module';
import { MessagesModule } from './messages/messages.module';
import { ClinicalNotesModule } from './clinical-notes/clinical-notes.module';
import { CarePlansModule } from './care-plans/care-plans.module';
import { CaregiversModule } from './caregivers/caregivers.module';
import { DevicesModule } from './devices/devices.module';
import { MedicationDbModule } from './medication-db/medication-db.module';
import { ConsentModule } from './consent/consent.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    // Global config from .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),

    // Global rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60_000,
        limit: 60,
      },
      {
        name: 'long',
        ttl: 600_000,
        limit: 300,
      },
    ]),

    // Core infrastructure
    DatabaseModule,
    HealthModule,

    // Feature modules — Auth & Core
    AuthModule,
    PatientsModule,
    MedicationsModule,
    ClinicalAlertsModule,
    NotificationsModule,
    AnalyticsModule,
    SyncModule,
    GatewayModule,

    // Feature modules — Sprint 8
    WellnessModule,
    EducationModule,
    MessagesModule,
    ClinicalNotesModule,
    CarePlansModule,
    CaregiversModule,
    DevicesModule,
    MedicationDbModule,
    ConsentModule,
    UploadsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
