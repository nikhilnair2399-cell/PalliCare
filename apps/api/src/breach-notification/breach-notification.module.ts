import { Module } from '@nestjs/common';
import { BreachNotificationController } from './breach-notification.controller';
import { BreachNotificationService } from './breach-notification.service';

@Module({
  controllers: [BreachNotificationController],
  providers: [BreachNotificationService],
  exports: [BreachNotificationService],
})
export class BreachNotificationModule {}
