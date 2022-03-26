import {
    Controller,
    Get, Headers, Param,
    Post,
    Res, SetMetadata, UnauthorizedException,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import { FileService } from './file.service';
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {v4} from 'uuid'
import * as fs from "fs";

import * as mime from 'mime-types';
import {Role} from "../user/model/user";

@Controller("/icons")
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: '/tmp', filename: (req, file, cb) => {
                cb(null, `${v4()}.${file.originalname.split('.').reverse()[0]}`)
            }
        })
    }))
    @SetMetadata('roles', [Role.ADMIN])
    async uploadFile(@UploadedFile() file: Express.Multer.File,
                     @Headers('user_id') adminId) {
        const iconId = await this.fileService.uploadFile(file.path);
        fs.unlink(file.path, (err) => { if(err) console.log(err); })
        return {
            icon_id : iconId
        }
    }

    @Get('/:iconId')
    async getFile(@Param('iconId') iconId, @Res() res) {
        res.set({
            'Content-Type': mime.lookup(iconId.split('.').reverse()[0])
        });
        this.fileService.getFile(iconId).pipe(res);
    }


}
