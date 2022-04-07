import {Injectable} from '@nestjs/common';

import {v4} from 'uuid';
import {Storage} from "@google-cloud/storage";
import {Readable} from "stream";


@Injectable()
export class FileService {
    private storage: Storage;

    constructor() {
        this.storage = new Storage();
    }

    getFile(fileId: string): Readable {
        return this.storage.bucket('lms-files').file(fileId).createReadStream();
    }

    async uploadFile(path : string) : Promise<string> {
        const fileId = v4() + "." + path.split('.').reverse()[0];
        await this.storage.bucket('lms-files').upload(path, {
            destination: fileId
        })
        return fileId;
    }


    async deleteFile(fileId : string) {
        await this.storage.bucket('lms-files').file(fileId).delete()
    }


}
