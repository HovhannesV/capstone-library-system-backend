import {
    BadRequestException,
    Body,
    Controller, DefaultValuePipe, Delete, Get, Headers,
    Post, Query,
    SetMetadata,
} from '@nestjs/common';
import {Role} from "../user/model/user";
import {IsString} from "class-validator";
import {FavoriteBooksService} from "./favorite-books-service";
import {BookService} from "./book.service";

class AddToFavoritesPayload {
    @IsString()
    bookId : string
}

@Controller("/books/favorites")
export class FavoriteBooksController {
    constructor(
        private readonly favoriteBooksService : FavoriteBooksService,
        private readonly bookService : BookService,
    ) {}


    @Get()
    @SetMetadata('roles', [Role.USER])
    async getFavoriteBooksOfUser(
        @Headers('user_id') userId,
        @Query('offset', new DefaultValuePipe(0)) offset : number,
        @Query('limit', new DefaultValuePipe(60)) limit : number
    ) {
        const bookIds = await this.favoriteBooksService.getFavoriteBookIdsOfUser(userId, offset, limit);
        console.log(await this.bookService.findBooksByIds(bookIds))
        return {
            status : 'success',
            response : await this.bookService.findBooksByIds(bookIds),
            metadata : {
                nextPage: `/books/favorite?offset=${offset}&limit=${limit}`
            }
        }
    }

    @Post()
    @SetMetadata('roles', [Role.USER])
    async addBookToFavorites(
        @Body() {bookId} : AddToFavoritesPayload,
        @Headers('user_id') userId
    ) {
        console.log(' dfgddddddddddd 1');
        if(!await this.bookService.findBookById(bookId)) {
            throw new BadRequestException("Book does not exist");
        }

        await this.favoriteBooksService.addBookToFavorites(userId, bookId);
        return {
            status : 'success',
            response : 'Book has been added to favorites'
        }
    }

    @Delete()
    @SetMetadata('roles', [Role.USER])
    async removeBookFromFavorites(
        @Query('bookId') bookId : string,
        @Headers('user_id') userId
    ) {
        console.log(' dfgddddddddddd 4');
        await this.favoriteBooksService.removeBookFromFavorites(userId, bookId);
        return {
            status : 'success',
            response : 'Book has been removed from favorites'
        }
    }




}
