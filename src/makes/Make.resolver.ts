import { Resolver, Query, Args } from '@nestjs/graphql';
import { Makes } from './entities/Makes';
import { MakesService } from './Make.service';


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
  findAll() {
    return this.makesService.findAll()
  }




}