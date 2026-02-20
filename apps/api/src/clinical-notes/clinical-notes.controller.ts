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
import { ClinicalNotesService } from './clinical-notes.service';
import { ParseUUIDPipe } from '../common/pipes/parse-uuid.pipe';

@ApiTags('clinical-notes')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class ClinicalNotesController {
  constructor(private readonly notesService: ClinicalNotesService) {}

  @Get('clinician/patients/:patientId/notes')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'List clinical notes for a patient' })
  @ApiQuery({ name: 'note_type', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  async getPatientNotes(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('note_type') noteType?: string,
    @Query('page') page?: number,
    @Query('per_page') perPage?: number,
  ) {
    return this.notesService.getByPatient(patientId, { noteType, page, perPage });
  }

  @Get('clinician/notes')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'List my clinical notes' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  async getMyNotes(
    @CurrentUser() user: CurrentUserPayload,
    @Query('page') page?: number,
    @Query('per_page') perPage?: number,
  ) {
    return this.notesService.getMyNotes(user.id, page, perPage);
  }

  @Get('clinician/notes/:id')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'Get clinical note detail' })
  async getNoteById(@Param('id', ParseUUIDPipe) id: string) {
    return this.notesService.getById(id);
  }

  @Post('clinician/patients/:patientId/notes')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'Create a clinical note' })
  async createNote(
    @CurrentUser() user: CurrentUserPayload,
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Body()
    body: {
      note_type: string;
      content: string;
      structured_data?: any;
      attachments?: any[];
      is_addendum?: boolean;
      parent_note_id?: string;
    },
  ) {
    return this.notesService.create(user.id, patientId, body);
  }

  @Patch('clinician/notes/:id')
  @Roles('clinician', 'admin')
  @ApiOperation({ summary: 'Update a clinical note' })
  async updateNote(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { content?: string; structured_data?: any; attachments?: any[] },
  ) {
    return this.notesService.update(id, body);
  }
}
