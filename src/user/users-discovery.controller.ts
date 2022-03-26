import {
    Controller, DefaultValuePipe, Get, Headers, ParseIntPipe, Query
} from '@nestjs/common';
import {UserService} from "./user.service";



@Controller("/users")
export class UsersDiscoveryController {

    constructor(
        private readonly userService : UserService
    ) {}

    @Get('/')
    async browseUsers(
        @Query('prefix', new DefaultValuePipe('')) prefix : string,
        @Query('offset' , new DefaultValuePipe(0), new ParseIntPipe()) offset : number,
        @Query('limit' , new DefaultValuePipe(60), new ParseIntPipe()) limit : number,
    ) {
        const users = await this.userService.getUsersByEmailPrefix(prefix || null, offset, limit);
        const nextPage = `/users?offset=${offset + limit}&limit=${limit}` + (prefix ? `&prefix=${prefix}` : '');

        return {
            status : 'success',
            response : users,
            metadata : {
                nextPage : users.length === limit ? nextPage : undefined
            }
        };
    }


}
