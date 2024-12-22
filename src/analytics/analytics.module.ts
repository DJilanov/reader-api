import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsEntity } from './entities/analytics.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([AnalyticsEntity]),
  ],
  controllers: [AnalyticsController],
  providers: [IsExist, IsNotExist, AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsVoteModule {}
