import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateAnalitycsDto {
  @ApiProperty({ example: 'event' })
  @IsOptional()
  event?: string | null;

  @ApiProperty({ example: 'value' })
  @IsOptional()
  value?: string | null;
}
