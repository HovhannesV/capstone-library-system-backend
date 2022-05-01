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

    @Prop({ type: Date, default : null })
    returnDate: Date;

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
        returnDate: 1,
        createDate : 1
    }
)

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
        partialFilterExpression: {  returnDate : { $eq: null } }
    }
)


BorrowSchema.index(
    {
        dueDate: 1
    },
    {
        partialFilterExpression: {  returnDate : { $eq: null } }
    }
)