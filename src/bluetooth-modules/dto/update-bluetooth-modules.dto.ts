import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class UpdateModuleDto {
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty()
  @MinLength(6)
  wall: string;

  @ApiProperty({ example: 'Example iosKey' })
  @IsOptional()
  iosKey: string;

  @ApiProperty({ example: 'Example androidKey' })
  @IsOptional()
  androidKey: string;

  @ApiProperty({ example: 'Example passcode' })
  @IsOptional()
  passcode: string;

  @ApiProperty({ example: 'Example manafucturerId' })
  @IsOptional()
  manafucturerId: string;
}
