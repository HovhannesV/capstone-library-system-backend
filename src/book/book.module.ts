import {forwardRef, Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {BookService} from "./book.service";
import {BookController} from "./book.controller";
import {Book, BookSchema} from "./model/book";
import {AuthorModule} from "../author/author.module";
import {GenreModule} from "../genre/genre.module";
import {CoverTypeModule} from "../coverType/cover-type.module";
import {BookInstanceController} from "./book-instance.controller";
import {BookInstanceService} from "./book-instance.service";
import {BookInstance, BookInstanceSchema} from "./model/book-instance";
import {FavoriteBooksController} from "./favorite-books.controller";
import {FavoriteBooksService} from "./favorite-books-service";
import {UserFavoriteBooks, UserFavoriteBooksSchema} from "./model/user-favorite-books";
import {BorrowModule} from "../borrow/borrow.module";



@Module({
    exports: [
        BookService
    ],
    controllers: [ FavoriteBooksController, BookController, BookInstanceController ],
    providers: [
        BookService,
        BookInstanceService,
        FavoriteBooksService
    ],
    imports : [
        MongooseModule.forFeature(
            [
                { name: Book.name, schema: BookSchema },
            ],
            'appDB',
        ),
        MongooseModule.forFeature(
            [
                { name: BookInstance.name, schema: BookInstanceSchema },
            ],
            'appDB',
        ),
        MongooseModule.forFeature(
            [
                { name: UserFavoriteBooks.name, schema: UserFavoriteBooksSchema },
            ],
            'appDB',
        ),
        AuthorModule,
        GenreModule,
        CoverTypeModule,
        forwardRef(() => BorrowModule)
    ]
})
export class BookModule {}
