import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { MakeModule } from '../makes/Make.module';
import { VehicleModule } from '../vehicle/Vehicle.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MakesSchema } from 'src/makes/schema/Makes.schema';
import { VehicleTypeSchema } from 'src/vehicle/schema/VehicleType.schema';

@Module({
  controllers: [DataController],
  providers: [DataService],
  imports: [
    MongooseModule.forFeature([
      { name: 'Makes', schema: MakesSchema },
      { name: 'VehicleType', schema: VehicleTypeSchema },
    ]),
    MakeModule,
    VehicleModule
  ]
})
export class DataModule { }
