import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class AuthChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  OldPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  NewPassword?: string;
}
