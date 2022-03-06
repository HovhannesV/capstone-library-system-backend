import { Module} from '@nestjs/common';
import {AuthGuard} from "./auth.guard";
import {UserService} from "./user.service";
import {UserController} from "./user.controller";
import {MongooseModule} from "@nestjs/mongoose";
import {UserSchema, User} from "./model/user";
import {GoogleAccountService} from "./google-account-service";


@Module({
    exports: [AuthGuard, UserService],
    controllers: [ UserController ],
    providers: [
        {
            provide: 'JWT_SECRET',
            useValue: process.env.JWT_SECRET,
        },
        AuthGuard,
        UserService,
        GoogleAccountService,
        {
            provide : 'GOOGLE_CLIENT_ID',
            useValue: process.env.GOOGLE_CLIENT_ID
        }
    ],
    imports : [
        MongooseModule.forFeature(
            [
                { name: User.name, schema: UserSchema },
            ],
            'appDB',
        )
    ]
})
export class UserModule {}
