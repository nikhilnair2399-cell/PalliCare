import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { VerificationRepository } from './verification.repository';

@Module({
  controllers: [VerificationController],
  providers: [VerificationService, VerificationRepository],
})
export class VerificationModule {}
