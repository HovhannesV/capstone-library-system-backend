import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type AuthorDocument = Author & mongoose.Document;

@Schema({
    timestamps: {
        createdAt: 'createDate',
        updatedAt: 'updateDate',
    },
    toObject: {
        getters: true,
    },
})
export class Author {
    id: string;

    @Prop({ type: String, required: true, index : true })
    name: string;

    @Prop({ type: String, required: true })
    imageId : string

    @Prop()
    createDate: Date;

    @Prop()
    updateDate: Date;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);