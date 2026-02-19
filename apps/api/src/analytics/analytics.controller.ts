import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('department-summary')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'Get department overview metrics' })
  async departmentSummary() {
    return this.analyticsService.getDepartmentSummary();
  }

  @Get('pain-distribution')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'Get pain score distribution' })
  async painDistribution() {
    return this.analyticsService.getPainDistribution();
  }

  @Get('medication-adherence')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'Get medication adherence trend' })
  async medicationAdherence(@Query('weeks') weeks?: number) {
    return this.analyticsService.getMedicationAdherence(weeks);
  }

  @Get('medd-distribution')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'Get MEDD distribution across patients' })
  async meddDistribution() {
    return this.analyticsService.getMeddDistribution();
  }

  @Get('quality-metrics')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'Get quality indicator metrics' })
  async qualityMetrics() {
    return this.analyticsService.getQualityMetrics();
  }
}
