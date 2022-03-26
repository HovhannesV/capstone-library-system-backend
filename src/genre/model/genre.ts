import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type GenreDocument = Genre & mongoose.Document;

@Schema({
    timestamps: {
        createdAt: 'createDate',
        updatedAt: 'updateDate',
    },
    toObject: {
        getters: true,
    },
})
export class Genre {
    id: string;

    @Prop({ type: String, required: true, unique : true })
    genre: string;

    @Prop()
    createDate: Date;

    @Prop()
    updateDate: Date;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);