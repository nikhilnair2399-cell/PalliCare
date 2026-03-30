import { Module } from '@nestjs/common';
import { ClinicalAlertsController } from './clinical-alerts.controller';
import { ClinicalAlertsService } from './clinical-alerts.service';
import { ClinicalAlertsRepository } from './clinical-alerts.repository';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [ClinicalAlertsController],
  providers: [ClinicalAlertsService, ClinicalAlertsRepository],
  exports: [ClinicalAlertsService],
})
export class ClinicalAlertsModule {}
