import { Module } from '@nestjs/common';
import { VehicleResolver } from './Vehicle.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleType } from './entities/VehicleType';
import { VehicleService } from './Vehicle.service';

@Module({
    providers: [VehicleResolver, VehicleService],
    imports: [
        TypeOrmModule.forFeature([VehicleType]),
    ],
    exports: [
        TypeOrmModule,
    ]
})
export class VehicleModule { }