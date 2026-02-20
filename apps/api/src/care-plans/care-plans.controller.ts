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
import { CarePlansService } from './care-plans.service';
import { ParseUUIDPipe } from '../common/pipes/parse-uuid.pipe';

@ApiTags('care-plans')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class CarePlansController {
  constructor(private readonly carePlansService: CarePlansService) {}

  @Get('clinician/patients/:patientId/care-plans')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'List care plans for a patient' })
  @ApiQuery({ name: 'status', required: false })
  async getPatientCarePlans(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('status') status?: string,
  ) {
    return this.carePlansService.getByPatient(patientId, status);
  }

  @Get('clinician/patients/:patientId/care-plans/active')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'Get active care plan for a patient' })
  async getActivePlan(
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ) {
    return this.carePlansService.getActivePlan(patientId);
  }

  @Get('clinician/care-plans/:id')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'Get care plan detail' })
  async getPlanById(@Param('id', ParseUUIDPipe) id: string) {
    return this.carePlansService.getById(id);
  }

  @Post('clinician/patients/:patientId/care-plans')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'Create a care plan' })
  async createPlan(
    @CurrentUser() user: CurrentUserPayload,
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Body()
    body: {
      title?: string;
      goals_of_care?: string;
      goals?: any[];
      interventions?: any[];
      tasks?: any[];
      review_date?: string;
      status?: string;
    },
  ) {
    return this.carePlansService.create(user.id, patientId, body);
  }

  @Patch('clinician/care-plans/:id')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'Update a care plan' })
  async updatePlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: Record<string, any>,
  ) {
    return this.carePlansService.update(id, body);
  }

  @Post('clinician/care-plans/:id/new-version')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'Create a new version of a care plan' })
  async createNewVersion(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.carePlansService.createNewVersion(id, user.id);
  }
}
