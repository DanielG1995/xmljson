import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Makes } from './schema/Makes.schema';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MakesService {

    constructor(
        // @InjectRepository(Makes)
        // private readonly makesModel: Repository<Makes>
        @InjectModel(Makes.name) private makesModel: Model<Makes>
    ) { }

    findAll(paginationArgs: PaginationArgs) {
        const { limit, offset } = paginationArgs;
        return this.makesModel
            .find()
            .populate('vehiclesType')
            .limit(limit)
            .skip(offset)
            .exec();
        //return this.makesModel.find({ relations: { vehiclesType: true } });
    }

    async findOneById(id: number) {
        const make = await this.makesModel
            .findOne({ makeId: id })
            .populate('vehiclesType')
            .exec();
        return make
    }

}