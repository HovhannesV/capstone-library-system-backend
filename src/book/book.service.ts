import {BadRequestException, Inject, Injectable, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Book, BookDocument} from "./model/book";
import {Model} from "mongoose";
import {IsArray, IsDate, IsDateString, IsNotEmpty, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreateBookPayload {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    coverImageId: string;

    @IsDateString()
    publishDate : Date

    @IsArray()
    @Type(() => String)
    genres: string[]

    @IsString()
    @IsNotEmpty()
    coverType: string

    @IsString()
    @IsNotEmpty()
    fileId: string

    @IsString()
    @IsNotEmpty()
    authorId: string;
}

import * as _ from 'lodash'
@Injectable()
export class BookService {

    @InjectModel(Book.name)
    private bookModel : Model<BookDocument>

    async createBook(bookPayload : CreateBookPayload) {
        return (await this.bookModel.create({
            ..._.omit(bookPayload, 'authorId'),
            author: bookPayload.authorId,
            favoritesCount: 0,
            authorKeywords : [],
            titleKeyword : [],
            descriptionKeywords: [],
            keywords: []
        })).toObject();
    }

    async findBookById(id : String) {
        return this.bookModel.findOne({_id : id}).populate('author')
    }

}