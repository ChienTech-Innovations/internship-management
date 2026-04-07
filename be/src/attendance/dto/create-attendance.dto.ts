import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class CreateAttendanceDto {
  @ApiProperty({
    example: '2026-02-16',
    description: 'Ngày đăng ký chấm công',
  })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({
    enum: ['office', 'remote'],
    example: 'office',
    description: 'Làm tại công ty hoặc tại nhà',
  })
  @IsNotEmpty()
  @IsEnum(['office', 'remote'])
  workLocation: string;

  @ApiPropertyOptional({
    example: 10.762622,
    description: 'Vĩ độ (latitude) - bắt buộc khi workLocation = office',
  })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiPropertyOptional({
    example: 106.660172,
    description: 'Kinh độ (longitude) - bắt buộc khi workLocation = office',
  })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;
}
