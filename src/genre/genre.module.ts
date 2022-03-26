import { Module} from '@nestjs/common';

import {Genre, GenreSchema} from "./model/genre";
import {UserModule} from "../user/user.module";
import {MongooseModule} from "@nestjs/mongoose";
import {GenreService} from "./genre.service";
import {GenreController} from "./genre.controller";


@Module({
    exports: [ GenreService ],
    controllers: [ GenreController ],
    providers: [
        GenreService
    ],
    imports : [
        MongooseModule.forFeature(
            [
                { name: Genre.name, schema: GenreSchema },
            ],
            'appDB',
        ),
        UserModule,
    ]
})
export class GenreModule {}
