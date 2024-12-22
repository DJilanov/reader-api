import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateLogDto {
  @ApiProperty({ example: 'log text' })
  @IsOptional()
  logText: string | null;

  @ApiProperty({ example: 0 })
  @IsOptional()
  rating?: number | null;

  @ApiProperty({ example: 0 })
  @IsOptional()
  grade?: string | null;

  @ApiProperty({ example: '03891fa9-aa95-4da8-b6e3-b10d50d7dbb8' })
  @IsOptional()
  routeId: string | null;
}
