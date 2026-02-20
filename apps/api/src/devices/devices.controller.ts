import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { DevicesService } from './devices.service';

@ApiTags('devices')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get()
  @ApiOperation({ summary: 'List my registered devices' })
  async getMyDevices(@CurrentUser() user: CurrentUserPayload) {
    return this.devicesService.getMyDevices(user.id);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register or update a device' })
  async registerDevice(
    @CurrentUser() user: CurrentUserPayload,
    @Body()
    body: {
      device_id: string;
      device_name?: string;
      platform: string;
      os_version?: string;
      app_version?: string;
      fcm_token?: string;
      apns_token?: string;
    },
  ) {
    return this.devicesService.registerDevice(user.id, body);
  }

  @Delete(':deviceId')
  @ApiOperation({ summary: 'Deactivate a device' })
  async deactivateDevice(
    @CurrentUser() user: CurrentUserPayload,
    @Param('deviceId') deviceId: string,
  ) {
    return this.devicesService.deactivateDevice(user.id, deviceId);
  }
}
