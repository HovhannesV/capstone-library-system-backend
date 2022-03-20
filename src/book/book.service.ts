import {BadRequestException, forwardRef, Inject, Injectable, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Book, BookDocument} from "./model/book";
import {Model} from "mongoose";
import {IsArray, IsDate, IsDateString, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {Transform, TransformFnParams, Type} from "class-transformer";
import * as Promise from 'bluebird'

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
    fileId: string

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    authorId: string;
}

export enum SORT {
    CREATE_DATE = 'createDate',
    FAVORITES_COUNT = 'favoritesCount',
    PUBLISH_DATE = 'publishDate',
}

export enum PARAM {
    AUTHOR = 'author',
    TITLE = 'title',
    DESCRIPTION = 'description',
    ALL = 'all'
}

import * as _ from 'lodash'
import {AuthorService} from "../author/author.service";
import {GenreService} from "../genre/genre.service";
import {extractKeywords, normalize} from "../utils";
import {BookInstanceService} from "./book-instance.service";
import {FavoriteBooksService} from "./favorite-books-service";
import * as natural from 'natural'
import {BorrowService} from "../borrow/borrow.service";

@Injectable()
export class BookService {

    @InjectModel(Book.name)
    private bookModel : Model<BookDocument>

    @Inject(AuthorService)
    private authorService : AuthorService

    @Inject(GenreService)
    private genreService : GenreService

    @Inject(BookInstanceService)
    private bookInstanceService : BookInstanceService

    @Inject(FavoriteBooksService)
    private favoriteBookService : FavoriteBooksService

    @Inject(BorrowService)
    private borrowService : BorrowService


    async createBook(bookPayload : CreateBookPayload) {
        if(!await this.genreService.validateGenres(bookPayload.genres)) {
            throw new BadRequestException('Not valid genres provided');
        }

        const author = await this.authorService.getAuthorById(bookPayload.authorId);

        if(!author) {
            throw new BadRequestException('Not valid author id provided');
        }

        const book = (await this.bookModel.create({
            ..._.omit(bookPayload, 'authorId'),
            author: bookPayload.authorId,
            favoritesCount: 0,
            authorKeywords : extractKeywords(author.name),
            titleKeywords : extractKeywords(bookPayload.title),
            descriptionKeywords: extractKeywords(bookPayload.description),
            keywords: extractKeywords(author.name, bookPayload.title, bookPayload.description),
            title : normalize(bookPayload.title),
            description: normalize(bookPayload.description),
        })).toObject();


        return this.getBookRepresentation(book);
    }

    async updateBookById(id : string, bookPayload : UpdateBookPayload) {

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
            book.title = normalize(bookPayload.title);
        }

        if(bookPayload.description) {
            book.descriptionKeywords = extractKeywords(bookPayload.description || '');
            book.description = normalize(bookPayload.description);
        }

        book.keywords = book.authorKeywords.concat(book.titleKeywords).concat(book.descriptionKeywords);

        await book.save();


        return this.getBookRepresentation(book.toObject());
    }

    async findBookById(id : string, userId : string) {
        return (await this.findBooksByIds([id], userId))[0];
    }

    async findBooksByIds(ids : string[], userId : string) {
        const books = await this.bookModel.find({_id : { $in : ids }}).populate('author')

        const orderedBooks = ids.map(id => books.find(book => book.id === id) || null);

        return Promise.all(orderedBooks.map(book => this.getBookRepresentation(book, userId)));
    }

    async getMostFavoriteBooks(offset : number, limit : number, userId : string) {
        const books = await this.bookModel.find({})
            .sort({ favoritesCount : -1 })
            .skip(offset)
            .limit(limit);

        return Promise.all(books.map(book => this.getBookRepresentation(book, userId)));
    }

    async getLatestBooks(offset : number, limit : number, userId : string) {
        const books = await this.bookModel.find({})
            .sort({ createDate : -1 })
            .skip(offset)
            .limit(limit);

        return Promise.all(books.map(book => this.getBookRepresentation(book, userId)));
    }

    async browseBooks(
        keywords : string[],
        param : PARAM, sort : SORT, descending : boolean,
        offset : number, limit : number,
        userId : string
    ) {
        const books = await this.bookModel.find({
            [param === PARAM.ALL ? 'keywords' : `${param}Keywords`] : {
                $all : keywords.map(keyword => natural.PorterStemmer.stem(keyword))
            }
        })
        .sort({ [sort] : descending ? -1 : 1 })
        .skip(offset)
        .limit(limit);

        return Promise.all(books.map(book => this.getBookRepresentation(book, userId)));
    }


    async deleteBookById(id : string) {
        await this.bookModel.deleteOne({_id : id});
        await this.bookInstanceService.deleteInstancesByBookId(id);
    }

    private async getBookRepresentation(book, userId ?: string) {
        if(!book) return book;
        const instances = await this.bookInstanceService.getInstancesByBookId(book.id);
        const instanceStatuses = await this.borrowService.checkForBorrowedInstances(instances.map(i => i.id))

        return {
            ..._.pick(
                book,
                'id',
                'description',
                'author',
                'title',
                'coverImageId',
                'publishDate',
                'fileId'
            ),
            instances : instances.map((inst, i) => ({...inst, taken : instanceStatuses[i] })),
            isFavorite : userId ? await this.favoriteBookService.isMarkedFavorite(userId, book.id) : undefined
        }
    }
}