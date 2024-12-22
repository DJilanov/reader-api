import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  provider?: string;

  socialId?: string | null;

  @ApiProperty({ example: 'test1@example.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty()
  @IsEmail()
  email: string | null;

  @ApiProperty({ example: 'John' })
  @IsOptional()
  firstName?: string | null;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  lastName?: string | null;

  @ApiProperty({
    example: '8d022997-2d2f-4cfa-b635-dbeab886e1c5',
  })
  @IsOptional()
  @Validate(IsExist, ['FileEntity', 'id'], {
    message: 'imageNotExists',
  })
  photo?: string | null = '8d022997-2d2f-4cfa-b635-dbeab886e1c5';

  @ApiProperty({
    example: '0',
  })
  @IsOptional()
  @Validate(IsExist, ['StatusEntity', 'id'], {
    message: 'statusNotExists',
  })
  status?: string = '0';

  @ApiProperty({ example: '8d022997-2d2f-4cfa-b635-dbeab886e1c5' })
  @IsOptional()
  organisationId?: string | null;

  @ApiProperty({ example: '4' })
  @IsOptional()
  role?: string | null;

  @ApiProperty({ example: '4' })
  @IsOptional()
  topGrade?: number | null;

  @ApiProperty({ example: '4' })
  @IsOptional()
  totalClimbs?: number | null;

  @ApiProperty({ example: '4' })
  @IsOptional()
  shadowBanned?: boolean | null;

  @ApiProperty({ example: '4' })
  @IsOptional()
  totalSends?: number | null;

  hash?: string | null;
}
