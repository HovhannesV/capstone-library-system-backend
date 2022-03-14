import { Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {BookService} from "./book.service";
import {BookController} from "./book.controller";
import {Book, BookSchema} from "./model/book";



@Module({
    exports: [
        BookService,
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
        )
    ]
})
export class BookModule {}
