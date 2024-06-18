import { Module } from '@nestjs/common';
import { MakesResolver } from './Make.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Makes } from './entities/Makes';
import { MakesService } from './Make.service';

@Module({
    providers: [MakesResolver, MakesService],
    imports: [
        TypeOrmModule.forFeature([Makes]),
    ],
    exports: [
        TypeOrmModule,
    ]
})
export class MakeModule { }