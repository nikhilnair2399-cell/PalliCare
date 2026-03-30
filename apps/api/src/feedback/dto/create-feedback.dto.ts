import {
  IsString,
  IsInt,
  IsOptional,
  IsNotEmpty,
  Min,
  Max,
  MaxLength,
  IsIn,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFeedbackDto {
  @ApiProperty({
    description: 'Screen the feedback originated from',
    example: 'home',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  screen: string;

  @ApiProperty({
    description: 'Star rating from 1 (poor) to 5 (excellent)',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({
    description: 'Feedback category',
    example: 'general',
    enum: ['general', 'pain_logging', 'medication', 'ui_ux', 'bug', 'suggestion'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['general', 'pain_logging', 'medication', 'ui_ux', 'bug', 'suggestion'])
  category?: string;

  @ApiPropertyOptional({
    description: 'Free-text comment (Hindi or English)',
    example: 'The pain logging screen is very easy to use!',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  text?: string;

  @ApiPropertyOptional({
    description: 'Client-side timestamp in ISO 8601 format',
    example: '2026-03-05T10:30:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  timestamp?: string;
}
