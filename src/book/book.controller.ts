import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Head,
    Headers,
    NotFoundException,
    Param,
    ParseArrayPipe,
    ParseBoolPipe,
    ParseEnumPipe, ParseIntPipe,
    Post,
    Put,
    Query,
    SetMetadata,
} from '@nestjs/common';
import {BookService, CreateBookPayload, PARAM, SORT, UpdateBookPayload} from "./book.service";

import * as _ from 'lodash'
import {Role} from "../user/model/user";

@Controller("/books")
export class BookController {
    constructor(
        private readonly bookService : BookService
    ) {}


    @Post('/')
    @SetMetadata('roles', [Role.ADMIN])
    async createBook(@Body() payload : CreateBookPayload) {
        const book = await this.bookService.createBook(payload);
        return {
            status : 'success',
            response : book
        }
    }

    @Get('/home')
    async getHomePageBooks(@Headers('user_id') userId) {
        const favoriteBooks = await this.bookService.getMostFavoriteBooks(0, 60, userId);
        const latestBooks = await this.bookService.getLatestBooks(0, 60, userId);

        return {
            status : 'success',
            response : {
                latestBooks,
                favoriteBooks
            }
        }
    }


    @Put('/:id')
    @SetMetadata('roles', [Role.ADMIN])
    async updateBookById(@Body() payload : UpdateBookPayload, @Param('id') id : string) {
        const book = await this.bookService.updateBookById(id, payload);
        return {
            status : 'success',
            response : book
        }
    }

    @Delete('/:id')
    @SetMetadata('roles', [Role.ADMIN])
    async deleteBookById(@Param('id') id : string) {
        await this.bookService.deleteBookById(id);
        return {
            status: 'success',
            response: 'Book deleted'
        }
    }

    @Get('/:id')
    async getBookId(@Param('id') id : string, @Headers('user_id') userId) {
        const book = await this.bookService.findBookById(id, userId);
        if(!book) throw new NotFoundException('Book not found');
        return {
            status : 'success',
            response : book
        }
    }


    @Get('/')
    async browseBooks(
        @Query('keywords', new ParseArrayPipe({items : String})) keywords : string[],
        @Query('param', new DefaultValuePipe(PARAM.ALL), new ParseEnumPipe(PARAM)) param : PARAM,
        @Query('sort', new DefaultValuePipe(SORT.CREATE_DATE), new ParseEnumPipe(SORT)) sort : SORT,
        @Query('descending' , new DefaultValuePipe(true), new ParseBoolPipe()) descending : boolean,
        @Query('offset' , new DefaultValuePipe(0), new ParseIntPipe()) offset : number,
        @Query('limit' , new DefaultValuePipe(60), new ParseIntPipe()) limit : number,
        @Headers('user_id') userId
    ) {
        const books = await this.bookService.browseBooks(keywords, param, sort, descending, offset, limit, userId);

        const nextPage = `/books?keywords=${keywords},param=${param},sort=${sort},descending=${descending},offset=${offset + limit},limit=${limit}`;

        return {
            status : 'success',
            response : books,
            metadata : {
                nextPage : books.length === limit ? nextPage : undefined
            }
        }
    }

}
