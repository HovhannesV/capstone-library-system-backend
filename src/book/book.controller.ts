import {
    Body,
    Controller, Delete, Get, Head, Headers, NotFoundException, Param,
    Post, Put,
    SetMetadata,
} from '@nestjs/common';
import {BookService, CreateBookPayload, UpdateBookPayload} from "./book.service";

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

}
