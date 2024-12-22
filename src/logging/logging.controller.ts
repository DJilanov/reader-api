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
  Req,
} from '@nestjs/common';
import { LoggingService } from './logging.service';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { UserGuard } from 'src/roles/user.guard';
import { AdminGuard } from 'src/roles/admin.guard';
import { infinityPagination } from 'src/utils/infinity-pagination';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@ApiTags('Log ascent')
@Controller({
  path: 'log-ascent',
  version: '1',
})
export class LoggingController {
  constructor(private readonly logsService: LoggingService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    if (limit > 5000) {
      limit = 50;
    }

    return infinityPagination(
      await this.logsService.findManyWithPagination({
        page,
        limit,
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.logsService.findOne({ id });
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateLogDto: UpdateLogDto) {
    return this.logsService.update(id, updateLogDto);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Req() request, @Body() createLogDto: CreateLogDto) {
    return this.logsService.create(createLogDto, request);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  remove(@Param('id') id: string) {
    return this.logsService.softDelete(id);
  }
}
