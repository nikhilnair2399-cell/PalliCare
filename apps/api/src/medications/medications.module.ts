import { Module } from '@nestjs/common';
import { MedicationsController } from './medications.controller';
import { MedicationsService } from './medications.service';
import { MedicationsRepository } from './medications.repository';
import { PatientsModule } from '../patients/patients.module';
import { ClinicalAlertsModule } from '../clinical-alerts/clinical-alerts.module';

@Module({
  imports: [PatientsModule, ClinicalAlertsModule],
  controllers: [MedicationsController],
  providers: [MedicationsService, MedicationsRepository],
  exports: [MedicationsService],
})
export class MedicationsModule {}
