import { Module } from '@nestjs/common';
import { WellnessController } from './wellness.controller';
import { WellnessService } from './wellness.service';
import { WellnessRepository } from './wellness.repository';
import { PatientsModule } from '../patients/patients.module';

@Module({
  imports: [PatientsModule],
  controllers: [WellnessController],
  providers: [WellnessService, WellnessRepository],
  exports: [WellnessService],
})
export class WellnessModule {}
