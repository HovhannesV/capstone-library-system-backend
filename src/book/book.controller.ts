import {
    Body,
    Controller, Get, Param,
    Post,
    SetMetadata,
} from '@nestjs/common';
import {BookService, CreateBookPayload} from "./book.service";

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
            response : {
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
                instances : []
            }
        }
    }

    @Get('/:id')
    async getBookId(@Param('id') id : string) {
        const book = await this.bookService.findBookById(id);
        return {
            status : 'success',
            response : {
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
                instances : []
            }
        }
    }

}
