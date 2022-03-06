import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type GenreDocument = Genre & mongoose.Document;

@Schema({
    timestamps: {
        createdAt: 'create_date',
        updatedAt: 'update_date',
    },
    toObject: {
        getters: true,
    },
})
export class Genre {
    id: string;

    @Prop({ type: String, required: true })
    genre: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);