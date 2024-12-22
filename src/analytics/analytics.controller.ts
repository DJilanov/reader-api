import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  Req,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CreatAnalitycsDto } from './dto/create-analytics.dto';
import { UpdateAnalitycsDto } from './dto/update-analytics.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { UserGuard } from 'src/roles/user.guard';
import { AdminGuard } from 'src/roles/admin.guard';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@ApiTags('Analytics')
@Controller({
  path: 'analytics',
  version: '1',
})
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() request) {
    return this.analyticsService.findManyWithPagination(request);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.analyticsService.findOne({ id });
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateLogDto: UpdateAnalitycsDto) {
    return this.analyticsService.update(id, updateLogDto);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Req() request, @Body() createLogDto: CreatAnalitycsDto) {
    return this.analyticsService.create(createLogDto, request);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  remove(@Param('id') id: string) {
    return this.analyticsService.softDelete(id);
  }
}
