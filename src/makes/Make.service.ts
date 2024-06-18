import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Makes } from './entities/Makes';

@Injectable()
export class MakesService {

    constructor(
        @InjectRepository(Makes)
        private readonly makesRepository: Repository<Makes>
    ) { }

    findAll() {
        return this.makesRepository.find({ relations: { vehiclesType: true } });
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