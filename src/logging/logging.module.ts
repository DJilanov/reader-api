import { Module } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { LoggingController } from './logging.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from './entities/log.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';

@Module({
  imports: [TypeOrmModule.forFeature([LogEntity])],
  controllers: [LoggingController],
  providers: [IsExist, IsNotExist, LoggingService],
  exports: [LoggingService],
})
export class LogModule {}
