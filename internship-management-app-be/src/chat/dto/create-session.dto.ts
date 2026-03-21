import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiPropertyOptional({ description: 'Tiêu đề của phiên chat (tuỳ chọn)' })
  @IsOptional()
  @IsString()
  title?: string;
}
