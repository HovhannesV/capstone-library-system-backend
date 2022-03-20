import {forwardRef, Module} from '@nestjs/common';
import {BorrowController} from "./borrow.controller";
import {BookModule} from "../book/book.module";
import {BorrowCoreModule} from "./borrow-core.module";
import {UserModule} from "../user/user.module";



@Module({
    exports: [],
    controllers: [ BorrowController ],
    providers: [],
    imports : [
        BorrowCoreModule,
        BookModule,
        UserModule
    ]
})
export class BorrowModule {}
