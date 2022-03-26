import { Module } from '@nestjs/common';
import {UserModule} from "./user/user.module";
import {AuthorModule} from "./author/author.module";
import {MongooseModule} from "@nestjs/mongoose";
import {FileModule} from "./file/file.module";
import {APP_GUARD} from "@nestjs/core";
import {AuthGuard} from "./user/auth.guard";
import {CoverTypeModule} from "./coverType/cover-type.module";
import {GenreModule} from "./genre/genre.module";
import {BookModule} from "./book/book.module";
import {BorrowModule} from "./borrow/borrow.module";

@Module({
    imports: [
        UserModule,
        AuthorModule,
        CoverTypeModule,
        GenreModule,
        MongooseModule.forRoot(
            process.env.MONGO_CONN_STRING,
            {
                connectionName: 'appDB',
            },
        ),
        FileModule,
        BookModule,
        BorrowModule
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        }
    ]
})
export class AppModule {}
