import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {Author} from "../../author/model/author";

export type BorrowDocument = Borrow & mongoose.Document;


@Schema({
    timestamps: {
        createdAt: 'createDate',
        updatedAt: 'updateDate',
    },
    toObject: {
        getters: true,
    },
})
export class Borrow {
    id: string;

    @Prop({ type: Date, required: true })
    dueDate: string;

    @Prop({ type: Date })
    returnDate: string;

    @Prop({ type: String, required : true, index : true })
    userId: string

    @Prop({ type: String, required : true })
    bookInstanceId: string

    @Prop({ index : true })
    createDate: Date;

    @Prop()
    updateDate: Date;
}

export const BorrowSchema = SchemaFactory.createForClass(Borrow);


BorrowSchema.index(
    {
        userId: 1,
        createDate : 1
    }
)

BorrowSchema.index(
    {
        bookInstanceId: 1
    },
    {
        unique: true,
        partialFilterExpression: { returnDate: { $exists: false } }
    }
)