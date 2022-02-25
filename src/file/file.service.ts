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

    getIcon(iconId: string): Readable {
        return this.storage.bucket('lms-images').file(iconId).createReadStream();
    }

    async uploadIcon(path : string) : Promise<string> {
        const iconId = v4() + "." + path.split('.').reverse()[0];
        await this.storage.bucket('lms-images').upload(path, {
            destination: iconId
        })
        return iconId;
    }
}
