import { Resolver, Query, Args } from '@nestjs/graphql';
import { VehicleType } from './schema/VehicleType.schema';
import { VehicleService } from './Vehicle.service';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';


@Resolver(() => VehicleType)
export class VehicleResolver {
  constructor(
    private readonly vehicleService: VehicleService,
  ) { }



  @Query(() => [VehicleType], { name: 'vehicleType' })
  findAll(@Args() paginationArgs: PaginationArgs) {
    return this.vehicleService.findAll(paginationArgs)
  }

  @Query(() => VehicleType, { name: 'vehicleById' })
  findById(@Args('id', { type: () => Number }) id: number) {
    return this.vehicleService.findOneById(id);
  }




}