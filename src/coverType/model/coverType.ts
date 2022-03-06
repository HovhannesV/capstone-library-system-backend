import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type CoverTypeDocument = CoverType & mongoose.Document;

@Schema({
    timestamps: {
        createdAt: 'create_date',
        updatedAt: 'update_date',
    },
    toObject: {
        getters: true,
    },
})
export class CoverType {
    id: string;

    @Prop({ type: String, required: true, unique : true })
    coverType: string;
}

export const CoverTypeSchema = SchemaFactory.createForClass(CoverType);