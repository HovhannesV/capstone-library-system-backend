import {
    Body,
    Controller, Delete, Get, NotFoundException, Param,
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


    @Get('/:id')
    @SetMetadata('roles', [Role.USER])
    async getBookId(@Param('id') id : string) {
        const book = await this.bookService.findBookById(id);
        if(!book) throw new NotFoundException('Book not found');
        return {
            status : 'success',
            response : book
        }
    }

}
