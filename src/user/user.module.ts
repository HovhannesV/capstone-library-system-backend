import { Module} from '@nestjs/common';
import {AuthGuard} from "./auth.guard";
import {UserService} from "./user.service";
import {UserController} from "./user.controller";
import {MongooseModule} from "@nestjs/mongoose";
import {UserSchema, User} from "./model/user";
import {GoogleAccountService} from "./google-account-service";
import {UsersDiscoveryController} from "./users-discovery.controller";


@Module({
    exports: [
        AuthGuard,
        UserService,
        'JWT_SECRET',
    ],
    controllers: [ UserController, UsersDiscoveryController ],
    providers: [
        AuthGuard,
        UserService,
        GoogleAccountService,
        {
            provide : 'GOOGLE_CLIENT_ID',
            useValue: process.env.GOOGLE_CLIENT_ID
        },
        {
            provide : 'EMAIL_DOMAIN_PATTERNS',
            useValue: require('../../email_config.json').emailDomainPatterns
        },
        {
            provide : 'ADMIN_EMAIL_PATTERNS',
            useValue: require('../../email_config.json').adminEmailPatterns
        },
        {
            provide: 'JWT_SECRET',
            useValue: process.env.JWT_SECRET,
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
