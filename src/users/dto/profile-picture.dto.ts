import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Validate } from 'class-validator';
import { IsExist } from '../../utils/validators/is-exists.validator';

export class UpdateProfilePictureDto {
  @ApiProperty({
    example: '8d022997-2d2f-4cfa-b635-dbeab886e1c5',
  })
  @IsOptional()
  @Validate(IsExist, ['FileEntity', 'id'], {
    message: 'imageNotExists',
  })
  picture?: string | null = '8d022997-2d2f-4cfa-b635-dbeab886e1c5';
}
