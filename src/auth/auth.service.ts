import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { RoleEnum } from 'src/roles/roles.enum';
import { StatusEnum } from 'src/statuses/statuses.enum';
import * as crypto from 'crypto';
import { plainToClass } from 'class-transformer';
import { StatusEntity } from 'src/statuses/entities/status.entity';
import { AuthProvidersEnum } from './auth-providers.enum';
import { SocialInterface } from 'src/social/interfaces/social.interface';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { UsersService } from 'src/users/users.service';
import { ForgotService } from 'src/forgot/forgot.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private forgotService: ForgotService,
    private mailService: MailService,
  ) {}

  async validateLogin(
    loginDto: AuthEmailLoginDto,
    role: number,
  ): Promise<{ token: string; user: UserEntity }> {
    const user: any = await this.usersService.findOne({
      email: loginDto.email,
    });
    if (!user || +user.role < role) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'notFound',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (user.provider !== AuthProvidersEnum.email) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: `needLoginViaProvider:${user.provider}`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password ? user.password : '',
    );

    if (isValidPassword) {
      const token = await this.jwtService.sign({
        id: user.id,
        role: user.role,
      });

      return {
        token,
        user,
      };
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'incorrectPassword',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async validateSocialLogin(
    authProvider: string,
    socialData: SocialInterface,
  ): Promise<{ token: string; user: UserEntity }> {
    let user: any;
    const socialEmail = socialData.email?.toLowerCase();

    const userByEmail = await this.usersService.findOne({
      email: socialEmail,
    });

    user = await this.usersService.findOne({
      socialId: socialData.id,
      provider: authProvider,
    });

    if (user) {
      if (socialEmail && !userByEmail) {
        user.email = socialEmail;
      }
      await this.usersService.update(user.id, user);
    } else if (userByEmail) {
      user = userByEmail;
    } else {
      const status = plainToClass(StatusEntity, {
        id: StatusEnum.active,
      });

      user = await this.usersService.create({
        email: socialEmail,
        firstName: socialData.firstName,
        lastName: socialData.lastName,
        socialId: socialData.id,
        provider: authProvider,
        unitSystem: 'Meter',
        height: '224',
        routeGradeSystem: 'French',
        boulderGradeSystem: 'ebleau',
        routeGrade: '[28]',
        boulderGrade: '[27]',
        role: RoleEnum.user,
        status,
      } as any);

      user = await this.usersService.findOne({
        id: user.id,
      });
    }

    const jwtToken = await this.jwtService.sign({
      id: user.id,
      role: user.role,
    });

    return {
      token: jwtToken,
      user,
    };
  }

  async register(dto: AuthRegisterLoginDto): Promise<number> {
    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const user: any = await this.usersService.create({
      ...dto,
      email: dto.email,
      role: RoleEnum.user,
      status: {
        id: StatusEnum.inactive,
      } as StatusEntity,
      hash,
    } as any);

    return user[0];
  }

  async confirmEmail(hash: string): Promise<void> {
    const user: any = await this.usersService.findOnePure({
      hash,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `notFound`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    user.hash = null;
    user.status = StatusEnum.active.toString();
    await user.save();
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findOne({
      email,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailNotExists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {
      const hash = crypto
        .createHash('sha256')
        .update(randomStringGenerator())
        .digest('hex');
      await this.forgotService.create({
        hash,
        user,
      });

      await this.mailService.forgotPassword({
        to: email,
        data: {
          hash: user.id,
        },
      });
    }
  }

  async resetPassword(id: string, password: string): Promise<UserEntity> {
    const user: any = await this.usersService.findOnePure({
      id,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            hash: `notFound`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (user.password) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            hash: `alreadySetup`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    user.password = password;
    user.status = StatusEnum.active.toString();
    await user.save();
    const token = await this.jwtService.sign({
      id: user.id,
      role: user.role,
    });
    return {
      ...user,
      token,
    } as any;
  }

  async me(user: UserEntity): Promise<UserEntity> {
    const me: any = await this.usersService.findOne({
      id: user.id,
    });
    return me;
  }

  async update(user: any, userDto: AuthUpdateDto): Promise<UserEntity> {
    if (userDto.password) {
      if (userDto.oldPassword) {
        const currentUser = await this.usersService.findOne({
          id: user.id,
        });

        const isValidOldPassword = await bcrypt.compare(
          userDto.oldPassword,
          currentUser.password,
        );

        if (!isValidOldPassword) {
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              errors: {
                oldPassword: 'incorrectOldPassword',
              },
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
      } else {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              oldPassword: 'missingOldPassword',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    await this.usersService.update(user.id, userDto as any);

    return this.usersService.findOne({
      id: user.id,
    }) as any;
  }

  async changePassword(data, request) {
    const user: any = await this.usersService.findOnePure({
      id: request.user.id,
    });
    user.password = data.NewPassword;
    await user.save();
    return null;
  }

  async resetUserPassword(data) {
    const user: any = await this.usersService.findOnePure({
      id: data.id,
    });
    user.password = data.NewPassword;
    await user.save();
    return null;
  }

  async softDelete(user: UserEntity): Promise<void> {
    await this.usersService.softDelete(user.id, false);
  }
}
