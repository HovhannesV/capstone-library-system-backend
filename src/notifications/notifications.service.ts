import {Inject, Injectable} from '@nestjs/common';
import {Cron, Interval, SchedulerRegistry} from '@nestjs/schedule';
import {BorrowService} from "../borrow/borrow.service";
import {UserService} from "../user/user.service";
import { initializeApp } from 'firebase-admin/app';
import {getMessaging} from "firebase-admin/messaging";
import {BookService} from "../book/book.service";
import {BookInstanceService} from "../book/book-instance.service";


@Injectable()
export class NotificationsService {
    @Inject()
    private borrowService : BorrowService

    @Inject()
    private userService : UserService

    @Inject()
    private bookService : BookService

    @Inject()
    private bookInstanceService : BookInstanceService

    private firebaseClient = getMessaging(initializeApp());

    @Cron("*/5 * * * *")
    async scanBorrows() {
        console.log("Scanning non returned borrows...");
        const interval = 5 * 60 * 1000;
        const day = 24 * 60 * 60 * 1000;
        const start = new Date( parseInt(new Date().getTime() / interval as any) * interval - interval + day);

        const resultIterator = await this.borrowService.getBorrowsByDueDate(start, interval);

        for await (const borrow of resultIterator) {
            const user = await this.userService.getById(borrow.userId);
            const bookInstance = await this.bookInstanceService.getById(borrow.bookInstanceId);
            const book = bookInstance ? await this.bookService.findBookById(bookInstance.bookId, borrow.userId) : null;

            const tokens = [...new Set(user.sessions.map(session => session.fcmToken).filter(Boolean))];
            await this.firebaseClient.sendAll(
                tokens.map(token => ({
                    data: {
                        text : "Dear Reader! You have a book to return tomorrow",
                        bookInstanceId : borrow.bookInstanceId,
                        bookId : book.id
                    },
                    token
                }))
            );
            console.log(`Sent notification to user with id ${borrow.userId} for book with id ${book.id} and instance id ${borrow.bookInstanceId}`);
        }
        console.log("Done. Sleeping...")
    }


}