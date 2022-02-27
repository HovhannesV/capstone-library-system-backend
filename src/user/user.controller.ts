import {
    Body,
    Controller, Delete, Get, Headers, Inject, Post, Query, SetMetadata,
} from '@nestjs/common';
import {UserService} from "./user.service";
import * as _ from 'lodash'

import {IsString} from "class-validator";
import { v4 as uuidv4 } from 'uuid';
import {GoogleAccountService} from "./google-account-service";


class CreateAccessTokenPayload {
    @IsString()
    refreshToken : string
}

class CreateSessionPayload {
    @IsString()
    token : string
}

@Controller("/user")
export class UserController {

    constructor(
        private readonly userService : UserService,
        private readonly googleAccountService : GoogleAccountService
    ) {}

    @Get('/')
    async getMyInfo(@Headers('user_id') userId) {
        return {
            status : 'success',
            response : _.pick(
                await this.userService.getById(userId),
                'id', 'email', 'name', 'profileImageUrl'
            )
        };
    }

    @Get('/tokens')
    @SetMetadata('auth', 'none')
    async getToken(@Body() payload : CreateAccessTokenPayload) {
        const user = await this.userService.getByRefreshToken(payload.refreshToken);

        const refreshToken = uuidv4();
        const token = this.userService.generateToken(user.id, user.role);

        await this.userService.updateRefreshToken(payload.refreshToken, refreshToken);

        return {
            status : 'success',
            response : {
                token,
                refreshToken
            }
        };
    }


    @Delete('/sessions')
    async deleteSession(@Headers('user_id') userId, @Query('refreshToken') refreshToken : string) {
        await this.userService.removeRefreshToken(userId, refreshToken);
        return {
            status : 'success',
            response : 'User has signed out'
        };
    }

    @Post('/sessions')
    @SetMetadata('auth', 'none')
    async createSession(@Body() body : CreateSessionPayload) {
        const userInfo = await this.googleAccountService.getUserInfo(body.token);

        let user = await this.userService.getUserByEmail(userInfo.email);
        if(!user) {
            user = await this.userService.createUserByEmail(userInfo);
        }

        const refreshToken = uuidv4();
        await this.userService.addRefreshToken(user.id, refreshToken);


        return {
            status : 'success',
            response : {
                token : this.userService.generateToken(user.id, user.role),
                refreshToken
            }
        }
    }

}
