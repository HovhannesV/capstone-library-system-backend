import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserFavoriteBooksDocument = UserFavoriteBooks & mongoose.Document;

@Schema({
    timestamps: {
        createdAt: 'createDate',
        updatedAt: 'updateDate',
    },
    toObject: {
        getters: true,
    },
})
export class UserFavoriteBooks {
    id: string;

    @Prop({ type: String, required : true })
    userId: string

    @Prop({ type: String, required : true })
    bookId: string

    @Prop()
    createDate: Date;

    @Prop()
    updateDate: Date;
}

export const UserFavoriteBooksSchema = SchemaFactory.createForClass(UserFavoriteBooks);

UserFavoriteBooksSchema.index({ userId : 1, bookId : 1 }, { unique : true });
UserFavoriteBooksSchema.index({ userId : 1, create_date : 1 });