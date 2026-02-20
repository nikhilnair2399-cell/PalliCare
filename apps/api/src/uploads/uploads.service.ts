import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';

export interface UploadResult {
  key: string;
  url: string;
  bucket: string;
  content_type: string;
  size: number;
}

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);
  private readonly s3: S3Client;
  private readonly bucketUploads: string;
  private readonly bucketMedia: string;
  private readonly endpoint: string;

  // 10 MB max for voice notes, 5 MB for photos
  private static readonly MAX_SIZES: Record<string, number> = {
    voice_note: 10 * 1024 * 1024,
    photo: 5 * 1024 * 1024,
    document: 20 * 1024 * 1024,
    avatar: 2 * 1024 * 1024,
  };

  private static readonly ALLOWED_TYPES: Record<string, string[]> = {
    voice_note: ['audio/aac', 'audio/mp4', 'audio/mpeg', 'audio/ogg', 'audio/webm', 'audio/wav'],
    photo: ['image/jpeg', 'image/png', 'image/webp'],
    document: ['application/pdf', 'image/jpeg', 'image/png'],
    avatar: ['image/jpeg', 'image/png', 'image/webp'],
  };

  constructor(private readonly config: ConfigService) {
    this.endpoint = this.config.get('S3_ENDPOINT', 'http://localhost:9000');
    this.bucketUploads = this.config.get('S3_BUCKET_UPLOADS', 'pallicare-uploads');
    this.bucketMedia = this.config.get('S3_BUCKET_MEDIA', 'pallicare-media');

    this.s3 = new S3Client({
      endpoint: this.endpoint,
      region: this.config.get('S3_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.config.get('S3_ACCESS_KEY_ID', 'minioadmin'),
        secretAccessKey: this.config.get('S3_SECRET_ACCESS_KEY', 'minioadmin'),
      },
      forcePathStyle: this.config.get('S3_FORCE_PATH_STYLE', 'true') === 'true',
    });
  }

  /**
   * Generate a pre-signed URL for client-side upload
   */
  async getPresignedUploadUrl(
    uploadType: string,
    contentType: string,
    userId: string,
  ): Promise<{ upload_url: string; key: string; expires_in: number }> {
    this.validateUploadType(uploadType, contentType);

    const ext = this.getExtension(contentType);
    const key = `${uploadType}/${userId}/${uuid()}.${ext}`;
    const bucket = this.getBucket(uploadType);

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });

    const expiresIn = 300; // 5 minutes
    const upload_url = await getSignedUrl(this.s3, command, { expiresIn });

    return { upload_url, key, expires_in: expiresIn };
  }

  /**
   * Generate a pre-signed URL for downloading/viewing
   */
  async getPresignedDownloadUrl(key: string, uploadType: string): Promise<string> {
    const bucket = this.getBucket(uploadType);
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    return getSignedUrl(this.s3, command, { expiresIn: 3600 });
  }

  /**
   * Delete a file from S3
   */
  async deleteFile(key: string, uploadType: string): Promise<void> {
    const bucket = this.getBucket(uploadType);
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    await this.s3.send(command);
    this.logger.log(`Deleted file: ${bucket}/${key}`);
  }

  private validateUploadType(uploadType: string, contentType: string) {
    const allowed = UploadsService.ALLOWED_TYPES[uploadType];
    if (!allowed) {
      throw new BadRequestException(
        `Invalid upload type: ${uploadType}. Allowed: ${Object.keys(UploadsService.ALLOWED_TYPES).join(', ')}`,
      );
    }
    if (!allowed.includes(contentType)) {
      throw new BadRequestException(
        `Content type ${contentType} not allowed for ${uploadType}. Allowed: ${allowed.join(', ')}`,
      );
    }
  }

  private getBucket(uploadType: string): string {
    return uploadType === 'avatar' || uploadType === 'photo'
      ? this.bucketMedia
      : this.bucketUploads;
  }

  private getExtension(contentType: string): string {
    const map: Record<string, string> = {
      'audio/aac': 'aac',
      'audio/mp4': 'm4a',
      'audio/mpeg': 'mp3',
      'audio/ogg': 'ogg',
      'audio/webm': 'webm',
      'audio/wav': 'wav',
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'application/pdf': 'pdf',
    };
    return map[contentType] || 'bin';
  }

  getMaxSize(uploadType: string): number {
    return UploadsService.MAX_SIZES[uploadType] || 5 * 1024 * 1024;
  }
}
