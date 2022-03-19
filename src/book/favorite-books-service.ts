import {BadRequestException, Inject, Injectable, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {BookInstance, BookInstanceDocument} from "./model/book-instance";

import {UserFavoriteBooks, UserFavoriteBooksDocument} from "./model/user-favorite-books";

@Injectable()
export class FavoriteBooksService {

    @InjectModel(UserFavoriteBooks.name)
    private userFavoriteBooks : Model<UserFavoriteBooksDocument>


    async addBookToFavorites(userId : string, bookId : string) {
        return (await this.userFavoriteBooks.create({
            bookId,
            userId
        })).toObject();
    }


    async removeBookFromFavorites(userId : string, bookId : string) {
        return this.userFavoriteBooks.remove({
            bookId,
            userId
        });
    }

    async getFavoriteBookIdsOfUser(userId : string, offset: number, limit: number) {
        const favorites = await this.userFavoriteBooks.find({
            userId
        }).sort({create_date : -1})
        .skip(offset)
        .limit(limit)
        .lean();
        return favorites.map(favorite => favorite.bookId);
    }





}