import { Module } from '@nestjs/common';
import { VehicleResolver } from './Vehicle.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleType } from './entities/VehicleType';

@Module({
    providers: [VehicleResolver],
    imports: [
        TypeOrmModule.forFeature([VehicleType]),
    ],
    exports: [
        TypeOrmModule,
    ]
})
export class VehicleModule { }