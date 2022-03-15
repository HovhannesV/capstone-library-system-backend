import {BadRequestException, Inject, Injectable, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Book, BookDocument} from "./model/book";
import {Model} from "mongoose";
import {IsArray, IsDate, IsDateString, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {Transform, TransformFnParams, Type} from "class-transformer";

export class UpdateBookPayload {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => value.trim())
    title?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => value.trim())
    description?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => value.trim())
    coverImageId?: string;

    @IsDateString()
    @IsOptional()
    publishDate?: Date

    @IsArray()
    @Type(() => String)
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => value.map(val => val.trim()))
    genres?: string[]

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    @IsOptional()
    coverType?: string

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    @IsOptional()
    fileId?: string

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    @IsOptional()
    authorId?: string;
}


export class CreateBookPayload {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    title: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    description: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    coverImageId: string;

    @IsDateString()
    publishDate : Date

    @IsArray()
    @Type(() => String)
    @Transform(({ value }: TransformFnParams) => value.map(val => val.trim()))
    genres: string[]

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    coverType: string

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    fileId: string

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    authorId: string;
}

import * as _ from 'lodash'
import {AuthorService} from "../author/author.service";
import {CoverTypeService} from "../coverType/cover-type.service";
import {GenreService} from "../genre/genre.service";
import {extractKeywords} from "../utils";
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
            authorKeywords : extractKeywords(author.name),
            titleKeyword : extractKeywords(bookPayload.title),
            descriptionKeywords: extractKeywords(bookPayload.description),
            keywords: extractKeywords(author.name, bookPayload.title, bookPayload.description),
            title : extractKeywords(bookPayload.title).join(' '),
            description: extractKeywords(bookPayload.description).join(' '),
        })).toObject();
    }


    async updateBookById(id : string, bookPayload : UpdateBookPayload) {
        if('coverType' in bookPayload && !await this.coverTypeService.validateCoverType(bookPayload.coverType)) {
            throw new BadRequestException('Not valid cover type provided');
        }

        if('genres' in bookPayload && !await this.genreService.validateGenres(bookPayload.genres)) {
            throw new BadRequestException('Not valid genres provided');
        }

        const book = await this.bookModel.findOne({_id : id});
        Object.assign(book, _.omit(bookPayload, 'authorId'));

        if(bookPayload.authorId) {
            const author = bookPayload.authorId ? await this.authorService.getAuthorById(bookPayload.authorId) : null;
            if(!author) {
                throw new BadRequestException('Not valid author id provided');
            }
            book.author = bookPayload.authorId;
            book.authorKeywords = extractKeywords(author.name || '');
        }

        if(bookPayload.title) {
            book.titleKeywords = extractKeywords(bookPayload.title || '');
            book.title = extractKeywords(bookPayload.title).join(' ');
        }

        if(bookPayload.description) {
            book.descriptionKeywords = extractKeywords(bookPayload.description || '');
            book.description = extractKeywords(bookPayload.description).join(' ');
        }

        book.keywords = book.authorKeywords.concat(book.titleKeywords).concat(book.descriptionKeywords);

        await book.save();

        return book.toObject();
    }

    async findBookById(id : string) {
        return this.bookModel.findOne({_id : id}).populate('author')
    }

    async deleteBookById(id : string) {
        await this.bookModel.deleteOne({_id : id});
    }


}