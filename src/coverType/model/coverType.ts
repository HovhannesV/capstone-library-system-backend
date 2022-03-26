import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type CoverTypeDocument = CoverType & mongoose.Document;

@Schema({
    timestamps: {
        createdAt: 'createDate',
        updatedAt: 'updateDate',
    },
    toObject: {
        getters: true,
    },
})
export class CoverType {
    id: string;

    @Prop({ type: String, required: true, unique : true })
    coverType: string;

    @Prop()
    createDate: Date;

    @Prop()
    updateDate: Date;
}

export const CoverTypeSchema = SchemaFactory.createForClass(CoverType);