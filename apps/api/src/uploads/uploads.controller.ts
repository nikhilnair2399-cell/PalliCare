import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { UploadsService } from './uploads.service';

@ApiTags('uploads')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('presign')
  @ApiOperation({
    summary: 'Get pre-signed URL for file upload',
    description:
      'Returns a pre-signed S3 URL. Client uploads directly to MinIO/S3. ' +
      'Upload types: voice_note, photo, document, avatar. ' +
      'Returns: { upload_url, key, expires_in }',
  })
  async getPresignedUploadUrl(
    @CurrentUser() user: CurrentUserPayload,
    @Body()
    body: {
      upload_type: string;
      content_type: string;
    },
  ) {
    const result = await this.uploadsService.getPresignedUploadUrl(
      body.upload_type,
      body.content_type,
      user.id,
    );
    return {
      ...result,
      max_size: this.uploadsService.getMaxSize(body.upload_type),
    };
  }

  @Get('presign/download')
  @ApiOperation({ summary: 'Get pre-signed URL for file download' })
  @ApiQuery({ name: 'key', required: true })
  @ApiQuery({ name: 'type', required: true })
  async getPresignedDownloadUrl(
    @Query('key') key: string,
    @Query('type') uploadType: string,
  ) {
    const url = await this.uploadsService.getPresignedDownloadUrl(key, uploadType);
    return { url, expires_in: 3600 };
  }

  @Delete()
  @ApiOperation({ summary: 'Delete an uploaded file' })
  async deleteFile(
    @Body() body: { key: string; upload_type: string },
  ) {
    await this.uploadsService.deleteFile(body.key, body.upload_type);
    return { deleted: true };
  }
}
