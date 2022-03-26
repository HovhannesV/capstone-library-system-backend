import {forwardRef, Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {Borrow, BorrowSchema} from "./model/borrow";
import {BorrowService} from "./borrow.service";
import {UserModule} from "../user/user.module";



@Module({
    exports: [
        BorrowService
    ],
    controllers: [ ],
    providers: [
        BorrowService
    ],
    imports : [
        MongooseModule.forFeature(
            [
                { name: Borrow.name, schema: BorrowSchema },
            ],
            'appDB',
        )
    ]
})
export class BorrowCoreModule {}
