import { Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {BookService} from "./book.service";
import {BookController} from "./book.controller";
import {Book, BookSchema} from "./model/book";
import {AuthorModule} from "../author/author.module";
import {GenreModule} from "../genre/genre.module";
import {CoverTypeModule} from "../coverType/cover-type.module";



@Module({
    exports: [
        BookService
    ],
    controllers: [ BookController ],
    providers: [
        BookService,
    ],
    imports : [
        MongooseModule.forFeature(
            [
                { name: Book.name, schema: BookSchema },
            ],
            'appDB',
        ),
        AuthorModule,
        GenreModule,
        CoverTypeModule
    ]
})
export class BookModule {}