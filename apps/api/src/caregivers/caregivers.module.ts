import { Module } from '@nestjs/common';
import { CaregiversController } from './caregivers.controller';
import { CaregiversService } from './caregivers.service';
import { CaregiversRepository } from './caregivers.repository';

@Module({
  controllers: [CaregiversController],
  providers: [CaregiversService, CaregiversRepository],
  exports: [CaregiversService],
})
export class CaregiversModule {}
