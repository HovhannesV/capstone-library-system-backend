import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";

@Module({
    imports: [
        // MongooseModule.forRoot(
        //     process.env.MONGO_CONN_STRING,
        //     {
        //         connectionName: 'appDB',
        //     },
        // ),
        //FileModule,
    ],
    providers: [
        // {
        //     provide: APP_GUARD,
        //     useClass: AuthGuard,
        // }
    ]
})
export class AppModule {}
