import {
  Controller,
  Get,
  Post,
  Body,
  Query,
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
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@ApiTags('feedback')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @Roles('patient', 'caregiver', 'clinician', 'admin')
  @ApiOperation({ summary: 'Submit in-app feedback (pilot)' })
  async create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateFeedbackDto,
  ) {
    return this.feedbackService.create(user.id, dto);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'List all feedback entries (admin only)' })
  @ApiQuery({ name: 'screen', required: false })
  @ApiQuery({ name: 'min_rating', required: false, type: Number })
  @ApiQuery({ name: 'max_rating', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  async list(
    @Query('screen') screen?: string,
    @Query('min_rating') minRating?: number,
    @Query('max_rating') maxRating?: number,
    @Query('page') page?: number,
    @Query('per_page') perPage?: number,
  ) {
    return this.feedbackService.list({
      screen,
      minRating: minRating ? Number(minRating) : undefined,
      maxRating: maxRating ? Number(maxRating) : undefined,
      page: page ? Number(page) : 1,
      perPage: perPage ? Number(perPage) : 20,
    });
  }
}
