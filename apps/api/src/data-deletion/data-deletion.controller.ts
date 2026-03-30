import {
  Controller,
  Get,
  Post,
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
import { DataDeletionService } from './data-deletion.service';

@ApiTags('data-deletion')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('data-deletion')
export class DataDeletionController {
  constructor(private readonly dataDeletionService: DataDeletionService) {}

  @Post('request')
  @ApiOperation({ summary: 'Request data deletion (DPDPA 2023)' })
  async requestDeletion(
    @CurrentUser() user: CurrentUserPayload,
    @Body()
    body: {
      request_type: 'full_erasure' | 'anonymization' | 'selective';
      categories?: string[];
    },
  ) {
    return this.dataDeletionService.requestDeletion(
      user.id,
      body.request_type,
      body.categories,
    );
  }

  @Get('requests')
  @ApiOperation({ summary: 'List my data deletion requests' })
  async listRequests(@CurrentUser() user: CurrentUserPayload) {
    return this.dataDeletionService.listRequests(user.id);
  }
}
