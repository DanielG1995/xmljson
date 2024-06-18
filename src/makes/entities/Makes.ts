import { Field, ObjectType } from '@nestjs/graphql';
import { VehicleType } from '../../vehicle/entities/VehicleType';
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Makes {

    @PrimaryColumn()
    @Field(() => Number)
    makeId: number

    @Field(() => String)
    @Column()
    makeName: string

    @Field(() => [VehicleType], { nullable: true, defaultValue: [] })
    @ManyToMany(() => VehicleType, (vehicleType) => vehicleType.makes)
    @JoinTable()
    vehiclesType?: VehicleType[];

}