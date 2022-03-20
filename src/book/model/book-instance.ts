import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type BookInstanceDocument = BookInstance & mongoose.Document;

@Schema({
    timestamps: {
        createdAt: 'createDate',
        updatedAt: 'updateDate',
    },
    toObject: {
        getters: true,
    },
})
export class BookInstance {
    id: string;

    @Prop({ type: String, required : true })
    coverType: string

    @Prop({ type: String, required : true })
    bookId: string

    @Prop({ type: Boolean, default: false })
    deleted : boolean

    @Prop()
    createDate: Date;

    @Prop()
    updateDate: Date;
}

export const BookInstanceSchema = SchemaFactory.createForClass(BookInstance);