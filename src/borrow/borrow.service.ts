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

        return (await this.borrowModel.create({
            ...payload
        })).toObject();
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
        return this.borrowModel.find({
            userId
        })
        .sort({ createDate : -1 })
        .skip(offset)
        .limit(limit);
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


}