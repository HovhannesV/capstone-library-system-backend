import {BadRequestException, Inject, Injectable, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Author, AuthorDocument} from "./model/author";
import {Model} from "mongoose";

import * as jwt from 'jsonwebtoken'
import {User, UserDocument} from "../user/model/user";

type UserInfo = {
    email : string,
    name : string,
    picture : string
}


@Injectable()
export class AuthorService {

    @InjectModel(Author.name)
    private authorModel : Model<AuthorDocument>


    async createAuthor(name: string, imageId: string) {
        return (await this.authorModel.create({
            name,
            imageId
        })).toObject();
    }

    async getAuthors(offset = 0, limit = 30) {
        return this.authorModel.find()
                        .sort({ name : 1 })
                        .skip(offset)
                        .limit(limit)
                        .lean();
    }

}