import {
  Controller,
  Get,
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
import { MedicationsService } from './medications.service';
import { PatientsService } from '../patients/patients.service';
import { ParseUUIDPipe } from '../common/pipes/parse-uuid.pipe';

@ApiTags('medications')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class MedicationsController {
  constructor(
    private readonly medsService: MedicationsService,
    private readonly patientsService: PatientsService,
  ) {}

  // ─── Clinician endpoints ──────────────────────────────────

  @Get('clinician/patients/:id/medications')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'List patient medications (clinician view)' })
  async getPatientMedications(@Param('id', ParseUUIDPipe) id: string) {
    return this.medsService.listForClinician(id);
  }

  // ─── Patient self endpoints ───────────────────────────────

  @Get('patients/me/medications')
  @Roles('patient', 'caregiver')
  @ApiOperation({ summary: 'List my medications' })
  async getMyMedications(
    @CurrentUser() user: CurrentUserPayload,
    @Query('status') status?: string,
  ) {
    const patient = await this.patientsService.getMyProfile(user.id);
    return this.medsService.listForPatient(patient.id, status || 'active');
  }

  @Get('patients/me/medications/schedule/today')
  @Roles('patient', 'caregiver')
  @ApiOperation({ summary: "Get today's medication schedule" })
  async getTodaySchedule(@CurrentUser() user: CurrentUserPayload) {
    const patient = await this.patientsService.getMyProfile(user.id);
    return this.medsService.getTodaySchedule(patient.id);
  }

  @Get('patients/me/medications/medd')
  @Roles('patient', 'caregiver', 'clinician')
  @ApiOperation({ summary: 'Calculate MEDD for active opioids' })
  async getMedd(@CurrentUser() user: CurrentUserPayload) {
    const patient = await this.patientsService.getMyProfile(user.id);
    return this.medsService.calculateMedd(patient.id);
  }

  @Post('patients/me/medications/:medId/logs')
  @Roles('patient', 'caregiver')
  @ApiOperation({ summary: 'Log medication administration' })
  async logMedication(
    @CurrentUser() user: CurrentUserPayload,
    @Param('medId', ParseUUIDPipe) medId: string,
    @Body() body: {
      status: string;
      actual_time?: string;
      notes?: string;
      skip_reason?: string;
      pain_before?: number;
      pain_after?: number;
    },
  ) {
    const patient = await this.patientsService.getMyProfile(user.id);
    return this.medsService.logAdministration({
      medication_id: medId,
      patient_id: patient.id,
      administered_by: user.id,
      ...body,
    });
  }

  @Get('patients/me/medications/:medId/logs')
  @Roles('patient', 'caregiver')
  @ApiOperation({ summary: 'Get medication administration logs' })
  async getMedLogs(
    @Param('medId', ParseUUIDPipe) medId: string,
    @Query('page') page?: number,
    @Query('per_page') perPage?: number,
  ) {
    return this.medsService.getMedLogs(medId, page, perPage);
  }
}
