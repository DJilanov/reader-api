import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Repository } from 'typeorm';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { LogEntity } from './entities/log.entity';

@Injectable()
export class LoggingService {
  constructor(
    @InjectRepository(LogEntity)
    private logsRepository: Repository<LogEntity>,
  ) {}

  create(createLogDto: CreateLogDto, request) {
    return this.logsRepository.save(
      this.logsRepository.create({
        ...createLogDto,
        userId: request.user.id,
      }),
    );
  }

  findManyWithPagination(paginationOptions: IPaginationOptions) {
    return this.logsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  findOne(fields: EntityCondition<LogEntity>) {
    return this.logsRepository.findOne({
      where: fields,
    });
  }

  update(id: string, updateLogDto: UpdateLogDto) {
    return this.logsRepository.save(
      this.logsRepository.create({
        id,
        ...updateLogDto,
      }),
    );
  }

  async softDelete(id: string): Promise<void> {
    await this.logsRepository.delete(id);
  }
}
