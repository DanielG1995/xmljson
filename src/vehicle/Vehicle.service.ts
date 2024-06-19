import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { VehicleType } from './entities/VehicleType';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';

@Injectable()
export class VehicleService {

    constructor(
        @InjectRepository(VehicleType)
        private readonly vehicleRepository: Repository<VehicleType>
    ) { }

    async findAll(paginationArgs: PaginationArgs) {
        const { limit, offset } = paginationArgs;
        const queryBuilder = this.vehicleRepository.createQueryBuilder('vehicleType')
            .skip(offset)
            .take(limit)
            .leftJoinAndSelect('vehicleType.makes', 'makes')

        return queryBuilder.getMany()
        //return this.makesRepository.find({ relations: { vehiclesType: true } });
    }


    async findOneById(id: number) {
        const make = await this.vehicleRepository.findOne({
            where: {
                typeId: id
            },
            relations: {
                makes: true,
            },
        })
        return make
    }

}