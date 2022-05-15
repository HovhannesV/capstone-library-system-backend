import {Module} from "@nestjs/common";
import {NotificationsService} from "./notifications.service";
import {BorrowModule} from "../borrow/borrow.module";
import {UserModule} from "../user/user.module";
import {MongooseModule} from "@nestjs/mongoose";
import {BorrowCoreModule} from "../borrow/borrow-core.module";
import { ScheduleModule } from '@nestjs/schedule';
import {BookModule} from "../book/book.module";

@Module({
    imports: [
        BorrowCoreModule,
        UserModule,
        MongooseModule.forRoot(
            process.env.MONGO_CONN_STRING,
            {
                connectionName: 'appDB',
            },
        ),
        BookModule,
        ScheduleModule.forRoot()
    ],
    providers: [
        NotificationsService,
        {
            provide: 'NOTIF_ICON_URL',
            useValue: process.env.NOTIF_ICON_URL || null,
        }
    ]
})
export class NotificationsModule {}
