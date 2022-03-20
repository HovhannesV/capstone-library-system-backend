import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {Author} from "../../author/model/author";

export type BookDocument = Book & mongoose.Document;



@Schema({
    timestamps: {
        createdAt: 'create_date',
        updatedAt: 'update_date',
    },
    toObject: {
        getters: true,
    },
})
export class Book {
    id: string;

    @Prop({ type: String, required: true })
    title: string;

    @Prop({ type: String, required: true })
    description: string;

    @Prop({ type: String, required: true })
    coverImageId: string;

    @Prop({ type: Date, required: true })
    publishDate : Date

    @Prop({ type: Number, required: true, index : true })
    favoritesCount: number;

    @Prop({ type: [{ type: String }], required: true })
    authorKeywords: string[]

    @Prop({ type: [{ type: String }], required: true })
    titleKeywords: string[]

    @Prop({ type: [{ type: String }], required: true })
    descriptionKeywords: string[]

    @Prop({ type: [{ type: String }], required: true })
    keywords: string[]

    @Prop({ type: [{ type: String }], required: true })
    genres: string[]

    @Prop({ type: String })
    fileId: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: Author.name })
    author: string;

    @Prop({ index : true })
    create_date: Date;

    @Prop()
    update_date: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);