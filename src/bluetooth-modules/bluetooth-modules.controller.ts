import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { BluetoothModulesService } from './bluetooth-modules.service';
import { CreateModuleDto } from './dto/create-bluetooth-modules.dto';
import { UpdateModuleDto } from './dto/update-bluetooth-modules.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/roles/admin.guard';
import { infinityPagination } from 'src/utils/infinity-pagination';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@ApiTags('Bluetooth modules')
@Controller({
  path: 'bluetooth-modules',
  version: '1',
})
export class BluetoothModulesController {
  constructor(private readonly modulesService: BluetoothModulesService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    if (limit > 5000) {
      limit = 50;
    }

    return infinityPagination(
      await this.modulesService.findManyWithPagination({
        page,
        limit,
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.modulesService.findOne({ id });
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateModuleDto) {
    return this.modulesService.update(id, updateProfileDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProfileDto: CreateModuleDto) {
    return this.modulesService.create(createProfileDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  remove(@Param('id') id: number) {
    return this.modulesService.softDelete(id);
  }
}
