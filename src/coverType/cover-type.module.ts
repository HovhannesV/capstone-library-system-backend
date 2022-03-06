import { Module} from '@nestjs/common';

import {UserModule} from "../user/user.module";
import {MongooseModule} from "@nestjs/mongoose";
import {CoverType, CoverTypeSchema} from "./model/coverType";
import {CoverTypeService} from "./cover-type.service";
import {CoverTypeController} from "./cover-type.controller";


@Module({
    exports: [],
    controllers: [ CoverTypeController ],
    providers: [
        CoverTypeService
    ],
    imports : [
        MongooseModule.forFeature(
            [
                { name: CoverType.name, schema: CoverTypeSchema },
            ],
            'appDB',
        ),
        UserModule,
    ]
})
export class CoverTypeModule {}
