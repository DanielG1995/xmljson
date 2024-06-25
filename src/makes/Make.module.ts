import { Module } from '@nestjs/common';
import { MakesResolver } from './Make.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Makes, MakesSchema } from './schema/Makes.schema';
import { MakesService } from './Make.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    providers: [MakesResolver, MakesService],
    imports: [
        MongooseModule.forFeature([{ name: Makes.name, schema: MakesSchema }]),
    ],
})
export class MakeModule { }