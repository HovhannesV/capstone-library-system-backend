import {
    BadRequestException,
    Body,
    Controller, Delete, Get, Headers, NotFoundException, Param,
    Post, Put,
    SetMetadata,
} from '@nestjs/common';
import {BookService, CreateBookPayload, UpdateBookPayload} from "./book.service";


import {CreateBookInstancePayload, BookInstanceService} from "./book-instance.service";
import {Role} from "../user/model/user";

@Controller("/books")
export class BookInstanceController {
    constructor(
        private readonly bookInstanceService : BookInstanceService,
        private readonly bookService : BookService
    ) {}


    @Post('/:id/instances')
    @SetMetadata('roles', [Role.ADMIN])
    async createBook(@Param('id') bookId, @Body() payload : CreateBookInstancePayload, @Headers('user_id') userId) {
        if(!await this.bookService.findBookById(bookId, userId)) {
            throw new BadRequestException("Book with given id does not exist");
        }
        const bookInstance = await this.bookInstanceService.createBookInstance(bookId, payload);
        return {
            status : 'success',
            response : bookInstance
        }
    }


    @Delete('/instances/:id')
    @SetMetadata('roles', [Role.ADMIN])
    async deleteBookById(@Param('id') id : string) {
        await this.bookInstanceService.deleteBookInstance(id);
        return {
            status: 'success',
            response: 'Book instance successfully deleted'
        }
    }

}
