import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { SyncService } from './sync.service';

@ApiTags('sync')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post()
  @ApiOperation({ summary: 'Batch sync offline records' })
  async sync(
    @CurrentUser() user: CurrentUserPayload,
    @Body() body: {
      device_id: string;
      records: Array<{
        type: 'symptom_log' | 'medication_log';
        data: Record<string, unknown>;
        local_id: string;
        created_at: string;
      }>;
    },
  ) {
    return this.syncService.processSync(
      user.id,
      body.device_id,
      body.records,
    );
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending sync records for device' })
  async getPending(@Query('device_id') deviceId: string) {
    return this.syncService.getPendingRecords(deviceId);
  }
}
