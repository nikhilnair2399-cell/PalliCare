import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserPayload,
} from '../auth/decorators/current-user.decorator';
import { DataPortabilityService } from './data-portability.service';

@ApiTags('data-portability')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('data-portability')
export class DataPortabilityController {
  constructor(
    private readonly dataPortabilityService: DataPortabilityService,
  ) {}

  @Post('export')
  @ApiOperation({ summary: 'Request a data export (DPDPA 2023)' })
  async requestExport(
    @CurrentUser() user: CurrentUserPayload,
    @Body()
    body: {
      export_type: 'full' | 'symptom_logs' | 'medications' | 'care_plans';
      format: 'json' | 'csv';
    },
  ) {
    return this.dataPortabilityService.requestExport(
      user.id,
      body.export_type,
      body.format,
    );
  }

  @Get('exports')
  @ApiOperation({ summary: 'List my data exports' })
  async listExports(@CurrentUser() user: CurrentUserPayload) {
    return this.dataPortabilityService.listExports(user.id);
  }

  @Get('exports/:id/download')
  @ApiOperation({ summary: 'Download a completed data export' })
  async downloadExport(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') exportId: string,
  ) {
    return this.dataPortabilityService.getExportDownload(user.id, exportId);
  }
}
