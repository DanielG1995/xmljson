import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Makes } from './entities/Makes';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';

@Injectable()
export class MakesService {

    constructor(
        @InjectRepository(Makes)
        private readonly makesRepository: Repository<Makes>
    ) { }

    findAll(paginationArgs: PaginationArgs) {
        const { limit, offset } = paginationArgs;
        const queryBuilder = this.makesRepository.createQueryBuilder('makes')
            .leftJoinAndSelect('makes.vehiclesType', 'vehiclesType')
            .take(limit)
            .skip(offset)

        return queryBuilder.getMany()
        //return this.makesRepository.find({ relations: { vehiclesType: true } });
    }

    async findOneById(id: number) {
        const make = await this.makesRepository.findOne({
            where: {
                makeId: id
            },
            relations: {
                vehiclesType: true,
            },
        })
        return make
    }

}