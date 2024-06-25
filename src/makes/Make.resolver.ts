import { Resolver, Query, Args } from '@nestjs/graphql';
import { Makes } from './schema/Makes.schema';
import { MakesService } from './Make.service';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';


@Resolver(() => Makes)
export class MakesResolver {
  constructor(
    private readonly makesService: MakesService,
    //private readonly debtsService: DebtsService
  ) { }

  @Query(() => Makes, { name: 'makeById' })
  findById(@Args('id', { type: () => Number }) id: number) {
    return this.makesService.findOneById(id);
  }

  @Query(() => [Makes], { name: 'make' })
  findAll(@Args() paginationArgs: PaginationArgs) {
    return this.makesService.findAll(paginationArgs)
  }




}