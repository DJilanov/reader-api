import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  Validate,
} from 'class-validator';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';

export class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty()
  @Validate(IsNotExist, ['UserEntity'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  email: string | null;

  @ApiProperty()
  @MinLength(6)
  @IsOptional()
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  firstName: string | null;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  lastName: string | null;

  @ApiProperty({ example: 192 })
  @IsOptional()
  height: number | null;

  @ApiProperty({ example: 'UIAA' })
  @IsOptional()
  routeGradeSystem: string | null = 'French';

  @ApiProperty({ example: 'hueco' })
  @IsOptional()
  boulderGradeSystem: string | null = 'ebleau';

  @ApiProperty({ example: 'Feet' })
  @IsOptional()
  unitSystem: string | null;

  @ApiProperty({ example: '[25]' })
  @IsOptional()
  boulderGrade: string | null;

  @ApiProperty({ example: '[16]' })
  @IsOptional()
  routeGrade: string | null;

  @ApiProperty({
    example: '8d022997-2d2f-4cfa-b635-dbeab886e1c5',
  })
  @IsOptional()
  photo?: string | null = '8d022997-2d2f-4cfa-b635-dbeab886e1c5';

  @ApiProperty({
    example: '0',
  })
  @IsOptional()
  status?: string = '0';

  @ApiProperty({ example: '8d022997-2d2f-4cfa-b635-dbeab886e1c5' })
  @IsOptional()
  organisationId?: string | null;

  hash?: string | null;
}
