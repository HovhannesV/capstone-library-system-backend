import {BadRequestException, forwardRef, Inject, Injectable, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {IsArray, IsDate, IsDateString, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {Transform, TransformFnParams, Type} from "class-transformer";



import * as _ from 'lodash'
import {Borrow, BorrowDocument} from "./model/borrow";
import {BookService} from "../book/book.service";
import {BookInstanceService} from "../book/book-instance.service";




export class UpdateBorrowPayload {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    status : string
}


@Injectable()
export class BorrowService {

    @InjectModel(Borrow.name)
    private borrowModel : Model<BorrowDocument>

    @Inject(forwardRef(() => BookService))
    private bookService : BookService

    @Inject(forwardRef(() => BookInstanceService))
    private bookInstanceService : BookInstanceService

    async createBorrow(
        payload : {
            bookInstanceId : string
            dueDate : Date,
            userId : string
        }
    ) {
        if(await this.checkForBorrowedInstances([payload.bookInstanceId])[0]) {
            throw new BadRequestException('Book instance already taken');
        }

        const borrow = (await this.borrowModel.create({
            ...payload
        })).toObject();


        return this.getBorrowRepresentation(borrow, payload.userId);
    }

    async checkForBorrowedInstances(bookInstanceIds : string[]) {
        const borrows = await this.borrowModel.find({
            bookInstanceId : {
                $in : bookInstanceIds
            },
            returnDate : {
                $exists : false
            }
        });

        return bookInstanceIds.map(id => borrows.some(borrow => borrow.bookInstanceId === id));
    }

    async getBorrows(userId : string, offset : number, limit : number) {
        const borrows = await this.borrowModel.find({
            userId
        })
        .sort({ createDate : -1 })
        .skip(offset)
        .limit(limit);


        return Promise.all(borrows.map(borrow => this.getBorrowRepresentation(borrow, userId)));
    }

    async markAsReturned(bookInstanceId : string) {
        await this.borrowModel.updateOne({
            returnDate : {
                $exists : false
            },
            bookInstanceId
        }, {
            $set : {
                returnDate : new Date()
            }
        })
    }


    private async getBorrowRepresentation(borrow, userId : string) {
        const bookInstance = await this.bookInstanceService.getById(borrow.bookInstanceId);
        const book = bookInstance ? await this.bookService.findBookById(bookInstance.bookId, userId) : null;

        return {
            ..._.pick(borrow, 'id', 'status', 'bookInstanceId', 'dueDate', 'returDate', 'createDate'),
            book
        }
    }


}