import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LogEntity } from 'src/logging/entities/log.entity';
import { AnalyticsEntity } from 'src/analytics/entities/analytics.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LogEntity]),
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([AnalyticsEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('auth.secret'),
        signOptions: {
          expiresIn: configService.get('auth.expires'),
        },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [IsExist, IsNotExist, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
