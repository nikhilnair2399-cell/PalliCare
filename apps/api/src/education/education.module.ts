import { Module } from '@nestjs/common';
import { EducationController } from './education.controller';
import { EducationService } from './education.service';
import { EducationRepository } from './education.repository';
import { PatientsModule } from '../patients/patients.module';

@Module({
  imports: [PatientsModule],
  controllers: [EducationController],
  providers: [EducationService, EducationRepository],
  exports: [EducationService],
})
export class EducationModule {}
