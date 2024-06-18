import { Resolver, Query, Mutation, Args, Int, ResolveField, Float, Parent } from '@nestjs/graphql';
import { VehicleType } from './entities/VehicleType';


@Resolver(() => VehicleType)
export class VehicleResolver {
  constructor(
    //private readonly usersService: UsersService,
    //private readonly debtsService: DebtsService
  ) { }



  @Query(() => [VehicleType], { name: 'vehicleType' })
  findAll() {
    return []
  }




}