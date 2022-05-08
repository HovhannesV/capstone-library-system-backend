import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {Author} from "../../author/model/author";
import {UserFavoriteBooksSchema} from "./user-favorite-books";

export type BookDocument = Book & mongoose.Document;



@Schema({
    timestamps: {
        createdAt: 'createDate',
        updatedAt: 'updateDate',
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

    @Prop({ type: String, default : null })
    fileId: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: Author.name })
    author: string;

    @Prop({ index : true })
    createDate: Date;

    @Prop()
    updateDate: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);

BookSchema.index({  createDate : 1 });
BookSchema.index({  favoritesCount : 1 });
BookSchema.index({  publishDate : 1 });

BookSchema.index({ authorKeywords : 1, createDate : 1 });
BookSchema.index({ authorKeywords : 1, favoritesCount : 1 });
BookSchema.index({ authorKeywords : 1, publishDate : 1 });

BookSchema.index({ titleKeywords : 1, createDate : 1 });
BookSchema.index({ titleKeywords : 1, favoritesCount : 1 });
BookSchema.index({ titleKeywords : 1, publishDate : 1 });


BookSchema.index({ descriptionKeywords : 1, createDate : 1 });
BookSchema.index({ descriptionKeywords : 1, favoritesCount : 1 });
BookSchema.index({ descriptionKeywords : 1, publishDate : 1 });

BookSchema.index({ keywords : 1, createDate : 1 });
BookSchema.index({ keywords : 1, favoritesCount : 1 });
BookSchema.index({ keywords : 1, publishDate : 1 });