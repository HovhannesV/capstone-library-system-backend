import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserFavoriteBooksDocument = UserFavoriteBooks & mongoose.Document;

@Schema({
    timestamps: {
        createdAt: 'create_date',
        updatedAt: 'update_date',
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
    create_date: Date;

    @Prop()
    update_date: Date;
}

export const UserFavoriteBooksSchema = SchemaFactory.createForClass(UserFavoriteBooks);

UserFavoriteBooksSchema.index({ userId : 1, bookId : 1 }, { unique : true });
UserFavoriteBooksSchema.index({ userId : 1, create_date : 1 });