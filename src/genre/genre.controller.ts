import {
    Body,
    Controller, DefaultValuePipe, Get, Post, Query, SetMetadata,
} from '@nestjs/common';
import {GenreService} from "./genre.service";
import {IsString} from "class-validator";
import * as _ from 'lodash'

class GenrePayload {
    @IsString()
    genre : string
}


@Controller("/genres")
export class GenreController {

    constructor(
        private readonly genreService : GenreService,
    ) {}

    @Post('/')
    @SetMetadata('roles', ['admin'])
    async addGenre(@Body() genrePayload : GenrePayload) {
        const genre = await this.genreService.createGenre(genrePayload.genre);
        return {
            status : 'success',
            response : _.pick(genre, 'genre')
        }
    }

    @Get('/')
    @SetMetadata('roles', ['admin'])
    async getGenres(@Query('offset', new DefaultValuePipe(0)) offset : number,
                     @Query('limit', new DefaultValuePipe(60)) limit : number) {

        const genres = await this.genreService.getGenres(offset, limit);
        return {
            status : 'success',
            response : genres.map(genre => _.pick(genre, 'genre')),
            metadata : {
                nextPage : genres.length === limit ? `/genres?offset=${offset + limit}&limit=${limit}` : undefined
            }
        }
    }


}
