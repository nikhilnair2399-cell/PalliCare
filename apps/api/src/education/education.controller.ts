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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { EducationService } from './education.service';
import { PatientsService } from '../patients/patients.service';
import { ParseUUIDPipe } from '../common/pipes/parse-uuid.pipe';

@ApiTags('education')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class EducationController {
  constructor(
    private readonly educationService: EducationService,
    private readonly patientsService: PatientsService,
  ) {}

  private async getPatientId(userId: string): Promise<string> {
    const patient = await this.patientsService.getMyProfile(userId);
    return patient.id;
  }

  // ─── Public Module Catalog ─────────────────────────────────

  @Get('learn/modules')
  @Roles('patient', 'caregiver', 'clinician')
  @ApiOperation({ summary: 'List all education modules' })
  @ApiQuery({ name: 'phase', required: false, type: Number })
  @ApiQuery({ name: 'content_type', required: false })
  @ApiQuery({ name: 'audience', required: false })
  async getModules(
    @Query('phase') phase?: number,
    @Query('content_type') contentType?: string,
    @Query('audience') audience?: string,
  ) {
    return this.educationService.getModules({ phase, contentType, audience });
  }

  @Get('learn/modules/:id')
  @Roles('patient', 'caregiver', 'clinician')
  @ApiOperation({ summary: 'Get education module detail' })
  async getModuleById(@Param('id', ParseUUIDPipe) id: string) {
    return this.educationService.getModuleById(id);
  }

  // ─── Patient Progress ─────────────────────────────────────

  @Get('patients/me/learn')
  @Roles('patient', 'caregiver')
  @ApiOperation({ summary: 'Get modules with my progress' })
  @ApiQuery({ name: 'phase', required: false, type: Number })
  async getMyModules(
    @CurrentUser() user: CurrentUserPayload,
    @Query('phase') phase?: number,
  ) {
    const patientId = await this.getPatientId(user.id);
    return this.educationService.getModulesWithProgress(patientId, phase);
  }

  @Get('patients/me/learn/overview')
  @Roles('patient', 'caregiver')
  @ApiOperation({ summary: 'Get overall education progress' })
  async getOverallProgress(@CurrentUser() user: CurrentUserPayload) {
    const patientId = await this.getPatientId(user.id);
    return this.educationService.getOverallProgress(patientId);
  }

  @Patch('patients/me/learn/:moduleId/progress')
  @Roles('patient')
  @ApiOperation({ summary: 'Update module progress' })
  async updateProgress(
    @CurrentUser() user: CurrentUserPayload,
    @Param('moduleId', ParseUUIDPipe) moduleId: string,
    @Body() body: { status?: string; progress_pct?: number; last_position?: any },
  ) {
    const patientId = await this.getPatientId(user.id);
    return this.educationService.updateProgress(patientId, moduleId, body);
  }

  // ─── Breathe Sessions ─────────────────────────────────────

  @Post('patients/me/breathe')
  @Roles('patient')
  @ApiOperation({ summary: 'Log a breathing/mindfulness session' })
  async createBreatheSession(
    @CurrentUser() user: CurrentUserPayload,
    @Body()
    body: {
      exercise_type: string;
      duration_seconds: number;
      pre_feeling?: string;
      post_feeling?: string;
      background_sound?: string;
      completed?: boolean;
      local_id?: string;
    },
  ) {
    const patientId = await this.getPatientId(user.id);
    return this.educationService.createBreatheSession(patientId, body);
  }

  @Get('patients/me/breathe')
  @Roles('patient', 'caregiver')
  @ApiOperation({ summary: 'List my breathing sessions' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getBreatheSessions(
    @CurrentUser() user: CurrentUserPayload,
    @Query('limit') limit?: number,
  ) {
    const patientId = await this.getPatientId(user.id);
    return this.educationService.getBreatheSessions(patientId, limit);
  }

  @Get('patients/me/breathe/stats')
  @Roles('patient', 'caregiver')
  @ApiOperation({ summary: 'Get breathing session statistics' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  async getBreathingStats(
    @CurrentUser() user: CurrentUserPayload,
    @Query('days') days?: number,
  ) {
    const patientId = await this.getPatientId(user.id);
    return this.educationService.getBreathingStats(patientId, days);
  }
}
