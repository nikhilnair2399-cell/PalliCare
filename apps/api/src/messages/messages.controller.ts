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
import { MessagesService } from './messages.service';
import { ParseUUIDPipe } from '../common/pipes/parse-uuid.pipe';

@ApiTags('messages')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @Roles('patient', 'caregiver', 'clinician')
  @ApiOperation({ summary: 'Get my messages' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'unread_only', required: false, type: Boolean })
  async getMyMessages(
    @CurrentUser() user: CurrentUserPayload,
    @Query('page') page?: number,
    @Query('per_page') perPage?: number,
    @Query('unread_only') unreadOnly?: string,
  ) {
    return this.messagesService.getMyMessages(user.id, {
      page,
      perPage,
      unreadOnly: unreadOnly === 'true',
    });
  }

  @Get('unread-count')
  @Roles('patient', 'caregiver', 'clinician')
  @ApiOperation({ summary: 'Get unread message count' })
  async getUnreadCount(@CurrentUser() user: CurrentUserPayload) {
    const count = await this.messagesService.getUnreadCount(user.id);
    return { count };
  }

  @Get('patient/:patientId')
  @Roles('clinician', 'caregiver', 'admin')
  @ApiOperation({ summary: 'Get messages for a patient context' })
  @ApiQuery({ name: 'thread_id', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  async getPatientMessages(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('thread_id') threadId?: string,
    @Query('page') page?: number,
    @Query('per_page') perPage?: number,
  ) {
    return this.messagesService.getPatientMessages(patientId, {
      page,
      perPage,
      threadId,
    });
  }

  @Get('patient/:patientId/threads')
  @Roles('clinician', 'caregiver', 'admin')
  @ApiOperation({ summary: 'Get message threads for a patient' })
  async getThreads(@Param('patientId', ParseUUIDPipe) patientId: string) {
    return this.messagesService.getThreads(patientId);
  }

  @Post()
  @Roles('patient', 'caregiver', 'clinician')
  @ApiOperation({ summary: 'Send a message' })
  async sendMessage(
    @CurrentUser() user: CurrentUserPayload,
    @Body()
    body: {
      patient_id: string;
      recipient_id?: string;
      thread_id?: string;
      content?: string;
      message_type?: string;
      media_url?: string;
    },
  ) {
    return this.messagesService.sendMessage({
      ...body,
      sender_id: user.id,
    });
  }

  @Patch(':id/read')
  @Roles('patient', 'caregiver', 'clinician')
  @ApiOperation({ summary: 'Mark message as read' })
  async markRead(@Param('id', ParseUUIDPipe) id: string) {
    return this.messagesService.markRead(id);
  }

  @Post('patient/:patientId/read-all')
  @Roles('patient', 'caregiver', 'clinician')
  @ApiOperation({ summary: 'Mark all messages read for patient context' })
  async markAllRead(
    @CurrentUser() user: CurrentUserPayload,
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ) {
    const count = await this.messagesService.markAllRead(user.id, patientId);
    return { marked: count };
  }
}
