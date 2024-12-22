import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { Repository } from 'typeorm';
import { CreateModuleDto } from './dto/create-bluetooth-modules.dto';
import { UpdateModuleDto } from './dto/update-bluetooth-modules.dto';
import { BluetoothModulesEntity } from './entities/bluetooth-modules.entity';

@Injectable()
export class BluetoothModulesService {
  constructor(
    @InjectRepository(BluetoothModulesEntity)
    private devicesRepository: Repository<BluetoothModulesEntity>,
  ) {}

  findManyWithPagination(paginationOptions: IPaginationOptions) {
    return this.devicesRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  findOne(fields: EntityCondition<BluetoothModulesEntity>) {
    return this.devicesRepository.findOne({
      where: fields,
    });
  }

  create(createProfileDto: CreateModuleDto) {
    return this.devicesRepository.save(
      this.devicesRepository.create(createProfileDto),
    );
  }

  update(id: string, updateProfileDto: UpdateModuleDto) {
    return this.devicesRepository.save(
      this.devicesRepository.create({
        id,
        ...updateProfileDto,
      }),
    );
  }

  async softDelete(id: number): Promise<void> {
    await this.devicesRepository.delete(id);
  }
}
