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
import { WellnessService } from './wellness.service';
import { PatientsService } from '../patients/patients.service';
import { ParseUUIDPipe } from '../common/pipes/parse-uuid.pipe';

@ApiTags('wellness')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('patients/me')
export class WellnessController {
  constructor(
    private readonly wellnessService: WellnessService,
    private readonly patientsService: PatientsService,
  ) {}

  /** Resolve authenticated user → patient record */
  private async getPatientId(userId: string): Promise<string> {
    const patient = await this.patientsService.getMyProfile(userId);
    return patient.id;
  }

  // ─── Wellness Summary ──────────────────────────────────────

  @Get('wellness/summary')
  @Roles('patient', 'caregiver')
  @ApiOperation({ summary: 'Get wellness dashboard summary' })
  async getWellnessSummary(@CurrentUser() user: CurrentUserPayload) {
    const patientId = await this.getPatientId(user.id);
    return this.wellnessService.getWellnessSummary(patientId);
  }

  // ─── Goals ─────────────────────────────────────────────────

  @Get('goals')
  @Roles('patient', 'caregiver')
  @ApiOperation({ summary: 'List my goals' })
  @ApiQuery({ name: 'status', required: false })
  async getGoals(
    @CurrentUser() user: CurrentUserPayload,
    @Query('status') status?: string,
  ) {
    const patientId = await this.getPatientId(user.id);
    return this.wellnessService.getGoals(patientId, status);
  }

  @Post('goals')
  @Roles('patient')
  @ApiOperation({ summary: 'Create a new goal' })
  async createGoal(
    @CurrentUser() user: CurrentUserPayload,
    @Body() body: Record<string, any>,
  ) {
    const patientId = await this.getPatientId(user.id);
    return this.wellnessService.createGoal(patientId, body);
  }

  @Patch('goals/:goalId')
  @Roles('patient')
  @ApiOperation({ summary: 'Update a goal' })
  async updateGoal(
    @Param('goalId', ParseUUIDPipe) goalId: string,
    @Body() body: Record<string, any>,
  ) {
    return this.wellnessService.updateGoal(goalId, body);
  }

  @Post('goals/:goalId/log')
  @Roles('patient', 'caregiver')
  @ApiOperation({ summary: 'Log goal completion for a day' })
  async logGoal(
    @Param('goalId', ParseUUIDPipe) goalId: string,
    @Body() body: { date: string; completed: boolean; notes?: string },
  ) {
    return this.wellnessService.logGoal(goalId, body.date, body.completed, body.notes);
  }

  @Get('goals/:goalId/history')
  @Roles('patient', 'caregiver')
  @ApiOperation({ summary: 'Get goal completion history' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  async getGoalHistory(
    @Param('goalId', ParseUUIDPipe) goalId: string,
    @Query('days') days?: number,
  ) {
    return this.wellnessService.getGoalHistory(goalId, days || 30);
  }

  // ─── Gratitude ─────────────────────────────────────────────

  @Get('gratitude')
  @Roles('patient', 'caregiver')
  @ApiOperation({ summary: 'List gratitude entries' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getGratitudeEntries(
    @CurrentUser() user: CurrentUserPayload,
    @Query('limit') limit?: number,
  ) {
    const patientId = await this.getPatientId(user.id);
    return this.wellnessService.getGratitudeEntries(patientId, limit);
  }

  @Get('gratitude/today')
  @Roles('patient', 'caregiver')
  @ApiOperation({ summary: 'Get today\'s gratitude entry' })
  async getTodayGratitude(@CurrentUser() user: CurrentUserPayload) {
    const patientId = await this.getPatientId(user.id);
    return this.wellnessService.getTodayGratitude(patientId);
  }

  @Post('gratitude')
  @Roles('patient')
  @ApiOperation({ summary: 'Save today\'s gratitude entry' })
  async saveGratitude(
    @CurrentUser() user: CurrentUserPayload,
    @Body() body: { content: string; voice_note_url?: string },
  ) {
    const patientId = await this.getPatientId(user.id);
    return this.wellnessService.saveGratitude(patientId, body.content, body.voice_note_url);
  }

  @Get('gratitude/streak')
  @Roles('patient', 'caregiver')
  @ApiOperation({ summary: 'Get gratitude streak count' })
  async getGratitudeStreak(@CurrentUser() user: CurrentUserPayload) {
    const patientId = await this.getPatientId(user.id);
    const streak = await this.wellnessService.getGratitudeStreak(patientId);
    return { streak };
  }

  // ─── Intentions ────────────────────────────────────────────

  @Get('intentions')
  @Roles('patient', 'caregiver')
  @ApiOperation({ summary: 'List recent intentions' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getIntentions(
    @CurrentUser() user: CurrentUserPayload,
    @Query('limit') limit?: number,
  ) {
    const patientId = await this.getPatientId(user.id);
    return this.wellnessService.getIntentions(patientId, limit);
  }

  @Get('intentions/today')
  @Roles('patient', 'caregiver')
  @ApiOperation({ summary: 'Get today\'s intention' })
  async getTodayIntention(@CurrentUser() user: CurrentUserPayload) {
    const patientId = await this.getPatientId(user.id);
    return this.wellnessService.getTodayIntention(patientId);
  }

  @Post('intentions')
  @Roles('patient')
  @ApiOperation({ summary: 'Set today\'s intention' })
  async saveIntention(
    @CurrentUser() user: CurrentUserPayload,
    @Body() body: { content: string; content_hi?: string; source?: string },
  ) {
    const patientId = await this.getPatientId(user.id);
    return this.wellnessService.saveIntention(patientId, body);
  }

  @Patch('intentions/:date/status')
  @Roles('patient')
  @ApiOperation({ summary: 'Update intention completion status' })
  async completeIntention(
    @CurrentUser() user: CurrentUserPayload,
    @Param('date') date: string,
    @Body() body: { status: string },
  ) {
    const patientId = await this.getPatientId(user.id);
    return this.wellnessService.completeIntention(patientId, date, body.status);
  }

  // ─── Milestones ────────────────────────────────────────────

  @Get('milestones')
  @Roles('patient', 'caregiver')
  @ApiOperation({ summary: 'List milestones' })
  @ApiQuery({ name: 'unseen_only', required: false, type: Boolean })
  async getMilestones(
    @CurrentUser() user: CurrentUserPayload,
    @Query('unseen_only') unseenOnly?: string,
  ) {
    const patientId = await this.getPatientId(user.id);
    return this.wellnessService.getMilestones(patientId, unseenOnly === 'true');
  }

  @Get('milestones/unseen-count')
  @Roles('patient', 'caregiver')
  @ApiOperation({ summary: 'Get unseen milestones count' })
  async getUnseenCount(@CurrentUser() user: CurrentUserPayload) {
    const patientId = await this.getPatientId(user.id);
    const count = await this.wellnessService.getUnseenCount(patientId);
    return { count };
  }

  @Patch('milestones/:id/seen')
  @Roles('patient')
  @ApiOperation({ summary: 'Mark a milestone as seen' })
  async markSeen(@Param('id', ParseUUIDPipe) id: string) {
    return this.wellnessService.markSeen(id);
  }

  @Post('milestones/mark-all-seen')
  @Roles('patient')
  @ApiOperation({ summary: 'Mark all milestones as seen' })
  async markAllSeen(@CurrentUser() user: CurrentUserPayload) {
    const patientId = await this.getPatientId(user.id);
    const count = await this.wellnessService.markAllSeen(patientId);
    return { marked: count };
  }
}
