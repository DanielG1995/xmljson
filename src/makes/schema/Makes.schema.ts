import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import * as mongoose from 'mongoose';
import { VehicleType } from '../../vehicle/schema/VehicleType.schema';

@ObjectType()
@Schema()
export class Makes extends Document {

    @Field(() => Number)
    @Prop({ required: true, unique: true })
    makeId: number;

    @Field(() => String)
    @Prop({ required: true })
    makeName: string;

    @Field(() => [VehicleType], { nullable: true, defaultValue: [] })
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VehicleType' }] })
    vehiclesType?: VehicleType[];

}

export const MakesSchema = SchemaFactory.createForClass(Makes).set('toJSON', {
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
    },
});;


export const MakeModel = mongoose.model<Makes>('Makes', MakesSchema);
