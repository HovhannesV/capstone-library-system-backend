import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type BookInstanceDocument = BookInstance & mongoose.Document;

@Schema({
    timestamps: {
        createdAt: 'create_date',
        updatedAt: 'update_date',
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
    create_date: Date;

    @Prop()
    update_date: Date;
}

export const BookInstanceSchema = SchemaFactory.createForClass(BookInstance);