import {BadRequestException, Inject, Injectable, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Book, BookDocument} from "./model/book";
import {Model} from "mongoose";
import {IsArray, IsDate, IsDateString, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {Transform, TransformFnParams, Type} from "class-transformer";



export class CreateBookInstancePayload {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    coverType: string

}

import {CoverTypeService} from "../coverType/cover-type.service";
import {BookInstance, BookInstanceDocument} from "./model/book-instance";

import * as _ from 'lodash'

@Injectable()
export class BookInstanceService {

    @InjectModel(BookInstance.name)
    private bookInstanceModel : Model<BookInstanceDocument>


    @Inject(CoverTypeService)
    private coverTypeService : CoverTypeService


    async createBookInstance(bookId : string, payload : CreateBookInstancePayload) {
        if(!await this.coverTypeService.validateCoverType(payload.coverType)) {
            throw new BadRequestException('Not valid cover type provided');
        }

        const instance = (await this.bookInstanceModel.create({
            ...payload,
            bookId
        })).toObject();

        return _.pick(instance, 'bookId', 'coverType', 'id')
    }


    async deleteBookInstance(id : string) {
        return this.bookInstanceModel.updateOne({
            _id : id
        }, {
            $set : {
                deleted : true
            }
        });
    }

    async deleteInstancesByBookId(bookId : string) {
        return this.bookInstanceModel.updateMany({
            bookId
        }, {
            $set : {
                deleted : true
            }
        });
    }

    async getById(id : string) {
        const instance = await this.bookInstanceModel.findOne({
            _id : id,
            deleted : false
        })
        return _.pick(instance,  'coverType', 'id', 'bookId');
    }

    async getInstancesByBookId(bookId : string) {
        const rawInstances = await this.bookInstanceModel.find({
            bookId,
            deleted : false
        })
        .sort({ create_date : -1 });

        return rawInstances.map(instance => _.pick(instance,  'coverType', 'id'))
    }




}