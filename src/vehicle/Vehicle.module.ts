import { Module } from '@nestjs/common';
import { VehicleResolver } from './Vehicle.resolver';
import { VehicleType, VehicleTypeSchema } from './schema/VehicleType.schema';
import { VehicleService } from './Vehicle.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    providers: [VehicleResolver, VehicleService],
    imports: [
        MongooseModule.forFeature([{ name: VehicleType.name, schema: VehicleTypeSchema }]),
    ],
})
export class VehicleModule { }