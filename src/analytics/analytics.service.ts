import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { Repository } from 'typeorm';
import { CreatAnalitycsDto } from './dto/create-analytics.dto';
import { UpdateAnalitycsDto } from './dto/update-analytics.dto';
import { AnalyticsEntity } from './entities/analytics.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(AnalyticsEntity)
    private analyticsRepository: Repository<AnalyticsEntity>,
  ) {}

  create(createLogDto: CreatAnalitycsDto, request) {
    return this.analyticsRepository.save(
      this.analyticsRepository.create({
        ...createLogDto,
        userId: request.user.id,
      }),
    );
  }

  async findManyWithPagination(request) {
    console.log('---request: ', request);
    return await [];
  }

  findOne(fields: EntityCondition<AnalyticsEntity>) {
    return this.analyticsRepository.findOne({
      where: fields,
    });
  }

  update(id: string, updateLogDto: UpdateAnalitycsDto) {
    return this.analyticsRepository.save(
      this.analyticsRepository.create({
        id,
        ...updateLogDto,
      }),
    );
  }

  async softDelete(id: string): Promise<void> {
    await this.analyticsRepository.delete(id);
  }
}
