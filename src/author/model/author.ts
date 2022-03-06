import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type AuthorDocument = Author & mongoose.Document;

@Schema({
    timestamps: {
        createdAt: 'create_date',
        updatedAt: 'update_date',
    },
    toObject: {
        getters: true,
    },
})
export class Author {
    id: string;

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true })
    imageId : string

    @Prop()
    create_date: Date;

    @Prop()
    update_date: Date;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);