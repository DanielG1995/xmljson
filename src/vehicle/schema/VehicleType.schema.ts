import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, model } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Schema()
export class VehicleType extends Document {

    @Field(() => Number)
    @Prop({ required: true, unique: true })
    typeId: number;

    @Field(() => String)
    @Prop({ required: true })
    typeName: string;
}

export const VehicleTypeSchema = SchemaFactory.createForClass(VehicleType).set('toJSON', {
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
    },
});;

export const MakeModel = mongoose.model<VehicleType>('VehicleType', VehicleTypeSchema);