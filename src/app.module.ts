import { Module } from '@nestjs/common';
import {UserModule} from "./user/user.module";
import {AuthorModule} from "./author/author.module";
import {MongooseModule} from "@nestjs/mongoose";
import {FileModule} from "./file/file.module";

@Module({
    imports: [
        UserModule,
        AuthorModule,
        MongooseModule.forRoot(
            process.env.MONGO_CONN_STRING,
            {
                connectionName: 'appDB',
            },
        ),
        FileModule,
    ]
})
export class AppModule {}
