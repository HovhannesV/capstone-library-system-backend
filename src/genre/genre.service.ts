import {BadRequestException, Inject, Injectable, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Genre, GenreDocument} from "./model/genre";
import {Model} from "mongoose";

type UserInfo = {
    email : string,
    name : string,
    picture : string
}


@Injectable()
export class GenreService {

    @InjectModel(Genre.name)
    private genreModel : Model<GenreDocument>


    async createGenre(genre: string) {
        return (await this.genreModel.create({
            genre
        })).toObject();
    }

    async getGenres(offset = 0, limit = 30) {
        return this.genreModel.find()
                        .sort({ genre : 1 })
                        .skip(offset)
                        .limit(limit)
                        .lean();
    }

}