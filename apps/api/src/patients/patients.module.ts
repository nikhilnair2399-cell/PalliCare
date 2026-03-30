import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { PatientsRepository } from './patients.repository';
import { ConsentModule } from '../consent/consent.module';
import { ClinicalAlertsModule } from '../clinical-alerts/clinical-alerts.module';

@Module({
  imports: [ConsentModule, ClinicalAlertsModule],
  controllers: [PatientsController],
  providers: [PatientsService, PatientsRepository],
  exports: [PatientsService, PatientsRepository],
})
export class PatientsModule {}
