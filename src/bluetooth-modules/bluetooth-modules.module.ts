import { Module } from '@nestjs/common';
import { BluetoothModulesService } from './bluetooth-modules.service';
import { BluetoothModulesController } from './bluetooth-modules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BluetoothModulesEntity } from './entities/bluetooth-modules.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';

@Module({
  imports: [TypeOrmModule.forFeature([BluetoothModulesEntity])],
  controllers: [BluetoothModulesController],
  providers: [IsExist, IsNotExist, BluetoothModulesService],
  exports: [BluetoothModulesService],
})
export class BluetoothModulesModule {}
