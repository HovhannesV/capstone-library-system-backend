import {
    Body,
    Controller, DefaultValuePipe, Get, Post, Query, SetMetadata,
} from '@nestjs/common';
import {AuthorService} from "./author.service";
import {IsString} from "class-validator";
import * as _ from 'lodash'

class AuthorPayload {
    @IsString()
    name : string

    @IsString()
    imageId: string
}


@Controller("/authors")
export class AuthorController {

    constructor(
        private readonly authorService : AuthorService,
    ) {}

    @Post('/')
    @SetMetadata('roles', ['admin'])
    async addAuthor(@Body() authorPayload : AuthorPayload) {
        const author = await this.authorService.createAuthor(authorPayload.name, authorPayload.imageId);
        return {
            status : 'success',
            response : _.pick(author, 'id', 'name')
        }
    }

    @Get('/')
    @SetMetadata('roles', ['admin'])
    async getAuthors(@Query('offset', new DefaultValuePipe(0)) offset : number,
                     @Query('limit', new DefaultValuePipe(60)) limit : number) {

        const author = await this.authorService.getAuthors(offset, limit);
        return {
            status : 'success',
            response : _.pick(author, 'id', 'name'),
            metadata : {
                nextPage : `/authors?offset=${offset + limit}&limit=${limit}`
            }
        }
    }


}
