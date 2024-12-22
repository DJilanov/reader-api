import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { Mailer } from 'src/utils/mailer';
import { JwtService } from '@nestjs/jwt';
import { LogEntity } from 'src/logging/entities/log.entity';
import { AnalyticsEntity } from 'src/analytics/entities/analytics.entity';

@Injectable()
export class UsersService {
  mailer = null;

  constructor(
    @InjectRepository(LogEntity)
    private loggedRepository: Repository<LogEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(AnalyticsEntity)
    private analyticsRepository: Repository<AnalyticsEntity>,
    private jwtService: JwtService,
  ) {
    this.mailer = Mailer();
  }

  async create(createProfileDto: CreateUserDto, role = 1) {
    const userData = createProfileDto;
    if (+role === 1) {
      userData.photo = userData.photo
        ? userData.photo
        : 'af4ac7e0-6280-4018-9089-1b7e70cf75b6';

      userData.organisationId = userData.organisationId
        ? userData.organisationId
        : '3dd9c12d-e2f1-4083-a330-f1dbafd92ed0';

      userData.status = userData.status ? userData.status : '0';
    }
    const newUser: any = await this.usersRepository.save(
      this.usersRepository.create({
        ...userData,
        role,
      } as any),
    );

    if (+role > 1) {
      this.mailer.sendEmail(newUser);
    }
    const user = await this.usersRepository.findOne({
      where: {
        id: newUser.id,
      },
      relations: ['organisationId', 'photo'],
    });
    const token = await this.jwtService.sign({
      id: user.id,
      role: user.role,
    });
    return {
      ...user,
      password: null,
      token,
    };
  }

  async findManyWithPagination(paginationOptions: IPaginationOptions, request) {
    const currentUser: any = await this.usersRepository.findOne({
      relations: ['organisationId'],
      where: {
        id: request.user.id,
      },
    });
    let where: any = [];
    if (+currentUser.role < 4) {
      where = paginationOptions.role.map((p) => ({
        role: p,
        organisationId: {
          id: currentUser.organisationId.id,
        },
      }));
    } else {
      where = paginationOptions.role.map((p) => ({
        role: p,
      }));
    }
    const users = await this.usersRepository.find({
      where,
      relations: ['organisationId'],
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
    return users;
  }

  async findOnePure(fields: EntityCondition<UserEntity>) {
    console.log('Fields: ', fields);
    return await this.usersRepository.findOne({
      where: fields,
      relations: ['organisationId', 'photo', 'currentGym', 'currentGym.map'],
    });
  }

  async findOne(fields: EntityCondition<UserEntity>) {
    const user = await this.usersRepository.findOne({
      where: fields,
      relations: ['organisationId', 'photo', 'currentGym', 'currentGym.map'],
    });
    return user;
  }

  async update(id: string, updateProfileDto: UpdateUserDto) {
    await this.usersRepository.update(
      {
        id,
      },
      {
        firstName: updateProfileDto.firstName,
        lastName: updateProfileDto.lastName,
        role: updateProfileDto.role,
      },
    );
    const user = await this.findOne({ id });

    return user;
  }

  async softDelete(id: string, isHard: boolean): Promise<void> {
    if (isHard) {
      await this.usersRepository.delete(id);
    } else {
      const user = await this.usersRepository.findOne({
        where: {
          id,
        },
      });
      await this.usersRepository.save(
        this.usersRepository.create({
          id,
          email: user.email + '_deactivated_' + +new Date(),
        } as any),
      );
      await this.usersRepository.softDelete(id);
    }
  }

  async getCurrentUser(request) {
    return await this.findOne({
      id: request.user.id,
    });
  }
}
