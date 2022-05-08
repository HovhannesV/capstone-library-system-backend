import {Injectable, NotFoundException} from '@nestjs/common';

import {v4} from 'uuid';
import {Storage} from "@google-cloud/storage";
import {Readable} from "stream";


@Injectable()
export class FileService {
    private storage: Storage;

    constructor() {
        this.storage = new Storage();
    }

    async getFile(fileId: string): Promise<Readable> {
        const fileExists = await (this.storage.bucket('lms-file').file(fileId).exists());
        if(!fileExists[0]) {
            throw new NotFoundException("File with given id not found");
        }
        return this.storage.bucket('lms-file').file(fileId).createReadStream();
    }

    async uploadFile(path : string) : Promise<string> {
        const fileId = v4() + "." + path.split('.').reverse()[0];
        await this.storage.bucket('lms-file').upload(path, {
            destination: fileId
        })
        return fileId;
    }


    async deleteFile(fileId : string) {
        await this.storage.bucket('lms-file').file(fileId).delete()
    }


}
