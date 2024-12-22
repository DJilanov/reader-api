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
  ParseArrayPipe,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { UserGuard } from 'src/roles/user.guard';
import { AdminGuard } from 'src/roles/admin.guard';
import { SuperAdminGuard } from 'src/roles/super-admin.guard';
import { infinityPagination } from 'src/utils/infinity-pagination';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Req() request,
    @Query('role', new DefaultValuePipe('[1]'), ParseArrayPipe) role: number[],
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    if (limit > 5000) {
      limit = 50;
    }

    return infinityPagination(
      await this.usersService.findManyWithPagination(
        {
          role,
          page,
          limit,
        },
        request,
      ),
      { page, limit, role },
    );
  }

  @Get('current-user')
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @HttpCode(HttpStatus.OK)
  getCurrentGym(@Req() request) {
    return this.usersService.getCurrentUser(request);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ id });
  }

  @Get('public-user/:id')
  @HttpCode(HttpStatus.OK)
  findOnePublic(@Param('id') id: string) {
    return this.usersService.findOne({ id });
  }

  @Post('basic')
  @HttpCode(HttpStatus.CREATED)
  createBasic(@Body() createProfileDto: CreateUserDto) {
    return this.usersService.create(createProfileDto, 1);
  }

  @Post('route-setter')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  createRouteSetter(@Body() createProfileDto: CreateUserDto) {
    return this.usersService.create(createProfileDto, 2);
  }

  @Post('admin')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  createAdmin(@Body() createProfileDto: CreateUserDto) {
    return this.usersService.create(createProfileDto, 3);
  }

  @Post('super-admin')
  @UseGuards(AuthGuard('jwt'), SuperAdminGuard)
  @HttpCode(HttpStatus.CREATED)
  createSuperAdmin(@Body() createProfileDto: CreateUserDto) {
    return this.usersService.create(createProfileDto, 4);
  }

  @Patch('basic/:id')
  @HttpCode(HttpStatus.OK)
  updateBasic(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateProfileDto);
  }

  @Patch('route-setter/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @HttpCode(HttpStatus.OK)
  updateRouteSetter(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateProfileDto);
  }

  @Patch('admin/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @HttpCode(HttpStatus.OK)
  updateAdmin(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateProfileDto);
  }

  @Patch('super-admin/:id')
  @UseGuards(AuthGuard('jwt'), SuperAdminGuard)
  @HttpCode(HttpStatus.OK)
  updateSuperAdmin(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateProfileDto);
  }

  @Delete('basic/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  removeBasic(@Param('id') id: string) {
    return this.usersService.softDelete(id, false);
  }

  @Delete('route-setter/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  removeRouteSetter(@Param('id') id: string) {
    return this.usersService.softDelete(id, true);
  }

  @Delete('admin/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  removeAdmin(@Param('id') id: string) {
    return this.usersService.softDelete(id, true);
  }

  @Delete('super-admin/:id')
  @UseGuards(AuthGuard('jwt'), SuperAdminGuard)
  removeSuperAdmin(@Param('id') id: string) {
    return this.usersService.softDelete(id, true);
  }
}
