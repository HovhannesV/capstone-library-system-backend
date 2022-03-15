import {
    Body,
    Controller, DefaultValuePipe, Get, Post, Query, SetMetadata,
} from '@nestjs/common';
import {AuthorService} from "./author.service";
import {IsString} from "class-validator";
import * as _ from 'lodash'
import {auth} from "google-auth-library";
import {Transform, TransformFnParams} from "class-transformer";

class AuthorPayload {
    @IsString()
    @Transform(({ value }: TransformFnParams) => value.trim())
    name : string

    @IsString()
    @Transform(({ value }: TransformFnParams) => value.trim())
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

        const authors = await this.authorService.getAuthors(offset, limit);
        return {
            status : 'success',
            response : authors.map(author => _.pick(author, 'id', 'name')),
            metadata : {
                nextPage : authors.length === limit ? `/authors?offset=${offset + limit}&limit=${limit}` : undefined
            }
        }
    }


}
