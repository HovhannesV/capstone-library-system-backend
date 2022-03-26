import {
    Body,
    Controller, Delete, Get, Headers, Inject, Post, Put, Query, SetMetadata,
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

    @IsString()
    fcmToken: string
}

class UpdateSessionPayload {
    @IsString()
    fcmToken: string
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
                'id', 'email', 'name', 'profileImageUrl', 'role'
            )
        };
    }

    @Post('/tokens')
    @SetMetadata('auth', 'none')
    async getToken(@Body() payload : CreateAccessTokenPayload) {
        const user = await this.userService.getByRefreshToken(payload.refreshToken);

        const token = this.userService.generateToken(user.id, user.role);

        return {
            status : 'success',
            response : {
                token
            }
        };
    }


    @Delete('/sessions')
    @SetMetadata('auth', 'none')
    async deleteSession(@Query('refreshToken') refreshToken : string) {
        await this.userService.removeSession(refreshToken);
        return {
            status : 'success',
            response : 'User has signed out'
        };
    }

    @Put('/sessions')
    @SetMetadata('auth', 'none')
    async updateSession(@Query('refreshToken') refreshToken : string, @Body() body : UpdateSessionPayload) {
        await this.userService.updateUserSession(refreshToken, body);
        return {
            status : 'success',
            response : 'User session has been updated'
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
        await this.userService.addSession(user.id, refreshToken, body.fcmToken);


        return {
            status : 'success',
            response : {
                token : this.userService.generateToken(user.id, user.role),
                refreshToken
            }
        }
    }

}
