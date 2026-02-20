import { Module } from '@nestjs/common';
import { MedicationDbController } from './medication-db.controller';
import { MedicationDbService } from './medication-db.service';
import { MedicationDbRepository } from './medication-db.repository';

@Module({
  controllers: [MedicationDbController],
  providers: [MedicationDbService, MedicationDbRepository],
  exports: [MedicationDbService],
})
export class MedicationDbModule {}
