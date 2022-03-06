import {BadRequestException, Inject, Injectable, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {CoverType, CoverTypeDocument} from "./model/coverType";
import {Model} from "mongoose";



@Injectable()
export class CoverTypeService {

    @InjectModel(CoverType.name)
    private coverTypeModel : Model<CoverTypeDocument>


    async createCoverType(coverType: string) {
        return (await this.coverTypeModel.create({
            coverType
        })).toObject();
    }

    async getCoverTypes(offset = 0, limit = 30) {
        return this.coverTypeModel.find()
                        .sort({ coverType : 1 })
                        .skip(offset)
                        .limit(limit)
                        .lean();
    }

}