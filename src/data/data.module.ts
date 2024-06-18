import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { MakeModule } from '../makes/Make.module';
import { VehicleModule } from '../vehicle/Vehicle.module';

@Module({
  controllers: [DataController],
  providers: [DataService],
  imports: [MakeModule, VehicleModule]
})
export class DataModule { }
