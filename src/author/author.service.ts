import {BadRequestException, Inject, Injectable, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Author, AuthorDocument} from "./model/author";
import {Model} from "mongoose";
import {extractKeywords} from "../utils";


@Injectable()
export class AuthorService {

    @InjectModel(Author.name)
    private authorModel : Model<AuthorDocument>


    async createAuthor(name: string, imageId: string) {
        return (await this.authorModel.create({
            name : extractKeywords(name).join(' '),
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

    async getAuthorById(id : string) {
        return this.authorModel.findOne({_id : id}).lean();
    }


}