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
import {AuthorService} from "../author/author.service";
import {CoverTypeService} from "../coverType/cover-type.service";
import {GenreService} from "../genre/genre.service";
@Injectable()
export class BookService {

    @InjectModel(Book.name)
    private bookModel : Model<BookDocument>

    @Inject(AuthorService)
    private authorService : AuthorService

    @Inject(CoverTypeService)
    private coverTypeService : CoverTypeService

    @Inject(GenreService)
    private genreService : GenreService


    async createBook(bookPayload : CreateBookPayload) {
        if(!await this.coverTypeService.validateCoverType(bookPayload.coverType)) {
            throw new BadRequestException('Not valid cover type provided');
        }

        if(!await this.genreService.validateGenres(bookPayload.genres)) {
            throw new BadRequestException('Not valid genres provided');
        }

        const author = await this.authorService.getAuthorById(bookPayload.authorId);

        if(!author) {
            throw new BadRequestException('Not valid author id provided');
        }

        return (await this.bookModel.create({
            ..._.omit(bookPayload, 'authorId'),
            author: bookPayload.authorId,
            favoritesCount: 0,
            authorKeywords : BookService.extractKeywords(author.name),
            titleKeyword : BookService.extractKeywords(bookPayload.title),
            descriptionKeywords: BookService.extractKeywords(bookPayload.description),
            keywords: BookService.extractKeywords(author.name, bookPayload.title, bookPayload.description),
        })).toObject();
    }

    async findBookById(id : String) {
        return this.bookModel.findOne({_id : id}).populate('author')
    }

    static extractKeywords(...strings) {
        return strings.map(str => str.split(' ').map(s => s.trim()))
            .reduce((result, strArray) => result.concat(strArray), [])
            .filter(Boolean)
    }

}