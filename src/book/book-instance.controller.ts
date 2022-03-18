import {
    BadRequestException,
    Body,
    Controller, Delete, Get, NotFoundException, Param,
    Post, Put,
    SetMetadata,
} from '@nestjs/common';
import {BookService, CreateBookPayload, UpdateBookPayload} from "./book.service";


import {CreateBookInstancePayload, BookInstanceService} from "./book-instance.service";

@Controller("/books")
export class BookInstanceController {
    constructor(
        private readonly bookInstanceService : BookInstanceService,
        private readonly bookService : BookService
    ) {}


    @Post('/:id/instances')
    @SetMetadata('roles', ['admin'])
    async createBook(@Param('id') bookId, @Body() payload : CreateBookInstancePayload) {
        if(!await this.bookService.findBookById(bookId)) {
            throw new BadRequestException("Book with given id does not exist");
        }
        const bookInstance = await this.bookInstanceService.createBookInstance(bookId, payload);
        return {
            status : 'success',
            response : bookInstance
        }
    }


    @Delete('/instances/:id')
    @SetMetadata('roles', ['admin'])
    async deleteBookById(@Param('id') id : string) {
        await this.bookInstanceService.deleteBookInstance(id);
        return {
            status: 'success',
            response: 'Book instance successfully deleted'
        }
    }

}
