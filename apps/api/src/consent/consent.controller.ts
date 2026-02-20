import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { ConsentService } from './consent.service';
import { Request } from 'express';

@ApiTags('consent')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('consent')
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  @Get()
  @ApiOperation({ summary: 'Get my active consents (DPDPA 2023)' })
  async getActiveConsents(@CurrentUser() user: CurrentUserPayload) {
    return this.consentService.getActiveConsents(user.id);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get full consent history' })
  async getAllConsents(@CurrentUser() user: CurrentUserPayload) {
    return this.consentService.getMyConsents(user.id);
  }

  @Get(':type/history')
  @ApiOperation({ summary: 'Get consent history for a type' })
  async getConsentHistory(
    @CurrentUser() user: CurrentUserPayload,
    @Param('type') type: string,
  ) {
    return this.consentService.getHistory(user.id, type);
  }

  @Post()
  @ApiOperation({ summary: 'Grant consent' })
  async grantConsent(
    @CurrentUser() user: CurrentUserPayload,
    @Req() req: Request,
    @Body()
    body: {
      consent_type: string;
      version: string;
      method?: string;
    },
  ) {
    return this.consentService.grantConsent(user.id, {
      ...body,
      ip_address: req.ip,
    });
  }

  @Delete(':type')
  @ApiOperation({ summary: 'Revoke consent' })
  async revokeConsent(
    @CurrentUser() user: CurrentUserPayload,
    @Param('type') type: string,
  ) {
    return this.consentService.revokeConsent(user.id, type);
  }
}
