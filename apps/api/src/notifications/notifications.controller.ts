import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';
import { ParseUUIDPipe } from '../common/pipes/parse-uuid.pipe';

@ApiTags('notifications')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'List my notifications' })
  async list(
    @CurrentUser() user: CurrentUserPayload,
    @Query('unread_only') unreadOnly?: boolean,
    @Query('type') type?: string,
    @Query('page') page?: number,
    @Query('per_page') perPage?: number,
  ) {
    return this.notifService.list(user.id, { unreadOnly, type, page, perPage });
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  async unreadCount(@CurrentUser() user: CurrentUserPayload) {
    return this.notifService.unreadCount(user.id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markAsRead(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.notifService.markAsRead(id, user.id);
  }

  @Post('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@CurrentUser() user: CurrentUserPayload) {
    return this.notifService.markAllAsRead(user.id);
  }

  @Post('device')
  @ApiOperation({ summary: 'Register device for push notifications' })
  async registerDevice(
    @CurrentUser() user: CurrentUserPayload,
    @Body() body: { fcm_token: string; platform: string; device_id?: string },
  ) {
    return this.notifService.registerDevice({
      userId: user.id,
      fcmToken: body.fcm_token,
      platform: body.platform,
      deviceId: body.device_id,
    });
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get notification preferences' })
  async getPreferences(@CurrentUser() user: CurrentUserPayload) {
    return this.notifService.getPreferences(user.id);
  }

  @Post('preferences')
  @ApiOperation({ summary: 'Update notification preference' })
  async updatePreference(
    @CurrentUser() user: CurrentUserPayload,
    @Body() body: { type: string; enabled?: boolean; channels?: string[] },
  ) {
    return this.notifService.updatePreference(user.id, body.type, body);
  }
}
