import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { BreachNotificationService } from './breach-notification.service';

@ApiTags('breach-notification')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('breach-notification')
export class BreachNotificationController {
  constructor(
    private readonly breachNotificationService: BreachNotificationService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Record a data breach (admin only)' })
  async recordBreach(
    @Body()
    body: {
      breach_type: string;
      description: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      affected_user_count: number;
      data_types_affected: string[];
      discovered_at: string;
    },
  ) {
    return this.breachNotificationService.recordBreach(body);
  }

  @Get()
  @ApiOperation({ summary: 'List all breach records (admin only)' })
  async listBreaches() {
    return this.breachNotificationService.listBreaches();
  }

  @Patch(':id/notify')
  @ApiOperation({ summary: 'Mark breach as notified (admin only)' })
  async markNotified(
    @Param('id') breachId: string,
    @Body()
    body: {
      notification_type: 'users_notified' | 'dpb_notified';
    },
  ) {
    return this.breachNotificationService.markNotified(
      breachId,
      body.notification_type,
    );
  }
}
