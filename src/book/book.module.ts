import { Module} from '@nestjs/common';
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



@Module({
    exports: [
        BookService
    ],
    controllers: [ BookController, BookInstanceController ],
    providers: [
        BookService,
        BookInstanceService
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
        AuthorModule,
        GenreModule,
        CoverTypeModule
    ]
})
export class BookModule {}
