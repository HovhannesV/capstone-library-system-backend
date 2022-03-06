import {
    Body,
    Controller, DefaultValuePipe, Get, Post, Query, SetMetadata,
} from '@nestjs/common';
import {CoverTypeService} from "./cover-type.service";
import {IsString} from "class-validator";
import * as _ from 'lodash'

class CoverTypePayload {
    @IsString()
    coverType : string
}


@Controller("/genres")
export class CoverTypeController {

    constructor(
        private readonly coverTypeService : CoverTypeService,
    ) {}

    @Post('/')
    @SetMetadata('roles', ['admin'])
    async addCoverType(@Body() genrePayload : CoverTypePayload) {
        const coverType = await this.coverTypeService.createCoverType(genrePayload.coverType);
        return {
            status : 'success',
            response : _.pick(coverType, 'coverType')
        }
    }

    @Get('/')
    @SetMetadata('roles', ['admin'])
    async getGenres(@Query('offset', new DefaultValuePipe(0)) offset : number,
                     @Query('limit', new DefaultValuePipe(60)) limit : number) {

        const coverTypes = await this.coverTypeService.getCoverTypes(offset, limit);
        return {
            status : 'success',
            response : coverTypes.map(coverType => _.pick(coverType, 'coverType')),
            metadata : {
                nextPage : coverTypes.length === limit ? `/genres?offset=${offset + limit}&limit=${limit}` : undefined
            }
        }
    }


}
