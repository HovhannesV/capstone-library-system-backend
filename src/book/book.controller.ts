import {
    Body,
    Controller, Delete, Get, NotFoundException, Param,
    Post, Put,
    SetMetadata,
} from '@nestjs/common';
import {BookService, CreateBookPayload, UpdateBookPayload} from "./book.service";

import * as _ from 'lodash'

@Controller("/books")
export class BookController {
    constructor(
        private readonly bookService : BookService
    ) {}


    @Post('/')
    @SetMetadata('roles', ['admin'])
    async createBook(@Body() payload : CreateBookPayload) {
        const book = await this.bookService.createBook(payload);
        return {
            status : 'success',
            response : book
        }
    }


    @Put('/:id')
    @SetMetadata('roles', ['admin'])
    async updateBookById(@Body() payload : UpdateBookPayload, @Param('id') id : string) {
        const book = await this.bookService.updateBookById(id, payload);
        return {
            status : 'success',
            response : book
        }
    }

    @Delete('/:id')
    @SetMetadata('roles', ['admin'])
    async deleteBookById(@Param('id') id : string) {
        await this.bookService.deleteBookById(id);
        return {
            status: 'success',
            response: 'Book deleted'
        }
    }

    @Get('/:id')
    async getBookId(@Param('id') id : string) {
        const book = await this.bookService.findBookById(id);
        if(!book) throw new NotFoundException('Book not found');
        return {
            status : 'success',
            response : book
        }
    }

}
