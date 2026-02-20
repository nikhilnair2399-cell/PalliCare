import { Module } from '@nestjs/common';
import { CarePlansController } from './care-plans.controller';
import { CarePlansService } from './care-plans.service';
import { CarePlansRepository } from './care-plans.repository';

@Module({
  controllers: [CarePlansController],
  providers: [CarePlansService, CarePlansRepository],
  exports: [CarePlansService],
})
export class CarePlansModule {}
