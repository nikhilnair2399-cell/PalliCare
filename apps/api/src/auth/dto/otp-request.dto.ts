import { IsString, Matches, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OtpRequestDto {
  @ApiProperty({
    description: 'Indian mobile number (10 digits or with +91 prefix)',
    example: '+919876543210',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\+91)?[6-9]\d{9}$/, {
    message: 'Please provide a valid Indian mobile number',
  })
  phone: string;
}
