import { Field, ObjectType } from '@nestjs/graphql';
import { Makes } from '../../makes/entities/Makes';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class VehicleType {


    @Field(() => Number)
    @PrimaryColumn()
    typeId: number

    @Field(() => String)
    @Column()
    typeName: string

    @Field(() => [Makes])
    @ManyToMany(() => Makes, (make) => make.vehiclesType)
    makes?: Makes[]

}