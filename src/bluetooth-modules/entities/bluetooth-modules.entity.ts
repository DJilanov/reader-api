import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class BluetoothModulesEntity extends EntityHelper {
  @ApiProperty({ example: 'bbb912bf-1f02-465f-bb46-9b35e8887852' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  iosKey: string | null;

  @Column({ nullable: true })
  androidKey: string | null;

  @Column({ nullable: true })
  moduleId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
