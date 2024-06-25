import { Injectable } from '@nestjs/common';
import { VehicleType } from './schema/VehicleType.schema';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class VehicleService {

    constructor(
        @InjectModel(VehicleType.name) private vehicleModel: Model<VehicleType>
    ) { }

    async findAll(paginationArgs: PaginationArgs) {
        const { limit, offset } = paginationArgs;
        return this.vehicleModel
            .find()
            .limit(limit)
            .skip(offset)
            .exec();
        //return this.makesRepository.find({ relations: { vehiclesType: true } });
    }


    async findOneById(id: number) {
        const vehicle = await this.vehicleModel
            .findOne({ makeId: id })
            .exec();
        return vehicle
    }

}