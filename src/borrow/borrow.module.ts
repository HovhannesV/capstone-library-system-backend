import {forwardRef, Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {Borrow, BorrowSchema} from "./model/borrow";
import {BorrowService} from "./borrow.service";
import {BorrowController} from "./borrow.controller";
import {BookModule} from "../book/book.module";
import {UserService} from "../user/user.service";



@Module({
    exports: [
        BorrowService
    ],
    controllers: [ BorrowController ],
    providers: [
        BorrowService
    ],
    imports : [
        MongooseModule.forFeature(
            [
                { name: Borrow.name, schema: BorrowSchema },
            ],
            'appDB',
        ),
        forwardRef(() => BookModule),
        UserService
    ]
})
export class BorrowModule {}
