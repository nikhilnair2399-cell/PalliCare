import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { CaregiversService } from './caregivers.service';
import { ParseUUIDPipe } from '../common/pipes/parse-uuid.pipe';

@ApiTags('caregivers')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class CaregiversController {
  constructor(private readonly caregiversService: CaregiversService) {}

  // ─── Caregiver Self ────────────────────────────────────────

  @Get('caregiver/patients')
  @Roles('caregiver')
  @ApiOperation({ summary: 'List patients I care for' })
  async getMyPatients(@CurrentUser() user: CurrentUserPayload) {
    return this.caregiversService.getMyPatients(user.id);
  }

  // ─── Clinician: Manage Caregivers ──────────────────────────

  @Get('clinician/patients/:patientId/caregivers')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'List caregivers for a patient' })
  async getPatientCaregivers(
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ) {
    return this.caregiversService.getByPatient(patientId);
  }

  @Patch('clinician/caregivers/:id')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'Update caregiver permissions' })
  async updateCaregiver(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: Record<string, any>,
  ) {
    return this.caregiversService.updateCaregiver(id, body);
  }

  // ─── Care Schedules ───────────────────────────────────────

  @Get('clinician/patients/:patientId/schedules')
  @Roles('clinician', 'caregiver', 'admin')
  @ApiOperation({ summary: 'Get care schedules for a patient' })
  @ApiQuery({ name: 'start_date', required: false })
  @ApiQuery({ name: 'end_date', required: false })
  async getSchedules(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
  ) {
    return this.caregiversService.getSchedules(patientId, startDate, endDate);
  }

  @Post('clinician/patients/:patientId/schedules')
  @Roles('clinician', 'caregiver', 'admin')
  @ApiOperation({ summary: 'Create a care schedule entry' })
  async createSchedule(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Body()
    body: {
      caregiver_id: string;
      date: string;
      start_time: string;
      end_time: string;
      notes?: string;
    },
  ) {
    return this.caregiversService.createSchedule({
      patient_id: patientId,
      ...body,
    });
  }

  @Patch('clinician/schedules/:id')
  @Roles('clinician', 'caregiver', 'admin')
  @ApiOperation({ summary: 'Update a care schedule entry' })
  async updateSchedule(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: Record<string, any>,
  ) {
    return this.caregiversService.updateSchedule(id, body);
  }

  @Delete('clinician/schedules/:id')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'Delete a care schedule entry' })
  async deleteSchedule(@Param('id', ParseUUIDPipe) id: string) {
    await this.caregiversService.deleteSchedule(id);
    return { deleted: true };
  }

  // ─── Handover Notes ───────────────────────────────────────

  @Get('clinician/patients/:patientId/handover-notes')
  @Roles('clinician', 'caregiver', 'admin')
  @ApiOperation({ summary: 'Get handover notes for a patient' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getHandoverNotes(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('limit') limit?: number,
  ) {
    return this.caregiversService.getHandoverNotes(patientId, limit);
  }

  @Post('clinician/patients/:patientId/handover-notes')
  @Roles('clinician', 'caregiver')
  @ApiOperation({ summary: 'Create a handover note' })
  async createHandoverNote(
    @CurrentUser() user: CurrentUserPayload,
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Body()
    body: {
      to_caregiver_id?: string;
      content: string;
      voice_note_url?: string;
    },
  ) {
    return this.caregiversService.createHandoverNote({
      from_caregiver_id: user.id,
      patient_id: patientId,
      ...body,
    });
  }
}
