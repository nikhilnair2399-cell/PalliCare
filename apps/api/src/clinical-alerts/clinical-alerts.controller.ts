import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { ClinicalAlertsService } from './clinical-alerts.service';
import { ParseUUIDPipe } from '../common/pipes/parse-uuid.pipe';

@ApiTags('clinical-alerts')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clinical-alerts')
export class ClinicalAlertsController {
  constructor(private readonly alertsService: ClinicalAlertsService) {}

  @Get()
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'List all clinical alerts' })
  async list(
    @Query('severity') severity?: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('per_page') perPage?: number,
  ) {
    return this.alertsService.list({ severity, status, page, perPage });
  }

  @Get('counts')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'Count active alerts by severity' })
  async counts() {
    return this.alertsService.countBySeverity();
  }

  @Get(':id')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'Get alert details' })
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.alertsService.getById(id);
  }

  @Patch(':id/acknowledge')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'Acknowledge an alert' })
  async acknowledge(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.alertsService.acknowledge(id, user.id);
  }

  @Patch(':id/resolve')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'Resolve an alert' })
  async resolve(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserPayload,
    @Body() body: { notes?: string },
  ) {
    return this.alertsService.resolve(id, user.id, body.notes);
  }

  @Post(':id/escalate')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'Escalate an alert' })
  async escalate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { escalate_to: string },
  ) {
    return this.alertsService.escalate(id, body.escalate_to);
  }
}
