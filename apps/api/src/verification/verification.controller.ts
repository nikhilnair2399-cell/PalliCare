import { Controller, Post, Get } from '@nestjs/common';
import { VerificationService } from './verification.service';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('run')
  async run() {
    return this.verificationService.runAllTests();
  }

  @Get('status')
  status() {
    return { status: 'ok', endpoint: 'verification' };
  }
}
