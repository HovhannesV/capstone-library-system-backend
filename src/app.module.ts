import { Module } from '@nestjs/common';

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
