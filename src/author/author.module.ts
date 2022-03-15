import { Module} from '@nestjs/common';

import {Author, AuthorSchema} from "./model/author";
import {UserModule} from "../user/user.module";
import {MongooseModule} from "@nestjs/mongoose";
import {AuthorService} from "./author.service";
import {AuthorController} from "./author.controller";


@Module({
    exports: [ AuthorService ],
    controllers: [ AuthorController ],
    providers: [
        AuthorService
    ],
    imports : [
        MongooseModule.forFeature(
            [
                { name: Author.name, schema: AuthorSchema },
            ],
            'appDB',
        ),
        UserModule,
    ]
})
export class AuthorModule {}
