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
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { PatientsService } from './patients.service';
import { ParseUUIDPipe } from '../common/pipes/parse-uuid.pipe';

@ApiTags('patients')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  // ─── Clinician endpoints (/clinician/patients) ────────────

  @Get('clinician/patients')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'List patients for clinician dashboard' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'sort_by', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  async listPatients(
    @Query('status') statusFilter?: string,
    @Query('sort_by') sortBy?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('per_page') perPage?: number,
  ) {
    return this.patientsService.listForClinician({
      statusFilter,
      sortBy,
      search,
      page: page || 1,
      perPage: perPage || 20,
    });
  }

  @Get('clinician/patients/:id')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'Get patient detail for clinician' })
  async getPatientDetail(@Param('id', ParseUUIDPipe) id: string) {
    return this.patientsService.getDetailForClinician(id);
  }

  @Get('clinician/patients/:id/pain-trends')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'Get patient pain trends' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  async getPainTrends(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('days') days?: number,
  ) {
    return this.patientsService.getPainTrends(id, days || 30);
  }

  @Get('clinician/patients/:id/symptom-logs')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'Get patient symptom logs' })
  async getPatientSymptomLogs(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('log_type') logType?: string,
    @Query('page') page?: number,
    @Query('per_page') perPage?: number,
  ) {
    return this.patientsService.getSymptomLogs(id, {
      startDate: from,
      endDate: to,
      logType,
      page,
      perPage,
    });
  }

  // ─── Patient self endpoints (/patients/me) ────────────────

  @Get('patients/me')
  @Roles('patient')
  @ApiOperation({ summary: 'Get my patient profile' })
  async getMyProfile(@CurrentUser() user: CurrentUserPayload) {
    return this.patientsService.getMyProfile(user.id);
  }

  @Patch('patients/me')
  @Roles('patient')
  @ApiOperation({ summary: 'Update my patient profile' })
  async updateMyProfile(
    @CurrentUser() user: CurrentUserPayload,
    @Body() body: Record<string, any>,
  ) {
    return this.patientsService.updateMyProfile(user.id, body);
  }

  @Post('patients/me/logs')
  @Roles('patient', 'caregiver')
  @ApiOperation({ summary: 'Create a symptom log' })
  async createLog(
    @CurrentUser() user: CurrentUserPayload,
    @Body() body: Record<string, any>,
  ) {
    // For patient self-logging, resolve patient_id from user
    const patient = await this.patientsService.getMyProfile(user.id);
    return this.patientsService.createSymptomLog(patient.id, user.id, body);
  }

  @Get('patients/me/logs')
  @Roles('patient', 'caregiver')
  @ApiOperation({ summary: 'List my symptom logs' })
  async getMyLogs(
    @CurrentUser() user: CurrentUserPayload,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
    @Query('log_type') logType?: string,
    @Query('page') page?: number,
    @Query('per_page') perPage?: number,
  ) {
    const patient = await this.patientsService.getMyProfile(user.id);
    return this.patientsService.getSymptomLogs(patient.id, {
      startDate,
      endDate,
      logType,
      page,
      perPage,
    });
  }

  @Get('patients/me/logs/summary/daily')
  @Roles('patient', 'caregiver')
  @ApiOperation({ summary: 'Get daily pain summary' })
  async getDailySummary(
    @CurrentUser() user: CurrentUserPayload,
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
  ) {
    const patient = await this.patientsService.getMyProfile(user.id);
    return this.patientsService.getDailyPainSummary(patient.id, startDate, endDate);
  }
}
