import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  Post,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthConfirmEmailDto } from './dto/auth-confirm-email.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { UserGuard } from 'src/roles/user.guard';
import { AuthChangePasswordDto } from './dto/auth-change-password';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(public service: AuthService) {}

  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: AuthEmailLoginDto) {
    return this.service.validateLogin(loginDto, 1);
  }

  @Post('email/route-setter/login')
  @HttpCode(HttpStatus.OK)
  public async routeSetterLogin(@Body() loginDTO: AuthEmailLoginDto) {
    return this.service.validateLogin(loginDTO, 2);
  }

  @Post('email/admin/login')
  @HttpCode(HttpStatus.OK)
  public async adminLogin(@Body() loginDTO: AuthEmailLoginDto) {
    return this.service.validateLogin(loginDTO, 3);
  }

  @Post('email/super-admin/login')
  @HttpCode(HttpStatus.OK)
  public async superAdminLogin(@Body() loginDTO: AuthEmailLoginDto) {
    return this.service.validateLogin(loginDTO, 4);
  }

  @Post('email/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: AuthRegisterLoginDto) {
    return this.service.register(createUserDto);
  }

  @Post('email/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmEmail(@Body() confirmEmailDto: AuthConfirmEmailDto) {
    return this.service.confirmEmail(confirmEmailDto.hash);
  }

  @Post('forgot/password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: AuthForgotPasswordDto) {
    return this.service.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset/password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto) {
    return this.service.resetPassword(
      resetPasswordDto.id,
      resetPasswordDto.password,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  public async me(@Request() request) {
    return this.service.me(request.user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @Patch('me')
  @HttpCode(HttpStatus.OK)
  public async update(@Request() request, @Body() userDto: AuthUpdateDto) {
    return this.service.update(request.user, userDto);
  }

  @ApiBearerAuth()
  @Patch('reset-password')
  @HttpCode(HttpStatus.OK)
  public async resetUserPassword(@Body() userDto: AuthChangePasswordDto) {
    return this.service.resetUserPassword(userDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  public async updatePassword(
    @Request() request,
    @Body() userDto: AuthChangePasswordDto,
  ) {
    return this.service.changePassword(userDto, request);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @Delete('me')
  @HttpCode(HttpStatus.OK)
  public async delete(@Request() request) {
    return this.service.softDelete(request.user);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @HttpCode(HttpStatus.OK)
  public async logout(@Body() loginDto: AuthEmailLoginDto) {
    return this.service.validateLogin(loginDto, 1);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @HttpCode(HttpStatus.OK)
  public async refresh(@Body() loginDto: AuthEmailLoginDto) {
    return this.service.validateLogin(loginDto, 1);
  }
}
