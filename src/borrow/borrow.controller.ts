import {
    BadRequestException,
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    forwardRef,
    Get,
    Headers,
    Inject,
    NotFoundException,
    Param,
    ParseEnumPipe,
    ParseIntPipe,
    Post,
    Put,
    Query,
    SetMetadata,
} from '@nestjs/common';
import {Role} from "../user/model/user";
import {BorrowService, STATUS, UpdateBorrowPayload} from "./borrow.service";
import {BookInstanceService} from "../book/book-instance.service";
import {UserService} from "../user/user.service";
import {IsDate, IsDateString, IsNotEmpty, IsString} from "class-validator";
import {Transform, TransformFnParams, Type} from "class-transformer";
import {BookService, PARAM} from "../book/book.service";
import * as _ from "lodash";
import * as Path from "path";


export class CreateBorrowPayload {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    userEmail : string

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    bookInstanceId : string


    @Type(() => Date)
    @IsDate()
    dueDate : Date
}


@Controller("/")
export class BorrowController {

    @Inject(BookService)
    private bookService : BookService

    @Inject(BookInstanceService)
    private readonly bookInstanceService : BookInstanceService

    constructor(
        private readonly borrowService : BorrowService,
        private readonly userService : UserService
    ) {}


    @Get('/borrows')
    async getBorrows(
        @Query('offset' , new DefaultValuePipe(0), new ParseIntPipe()) offset : number,
        @Query('limit' , new DefaultValuePipe(60), new ParseIntPipe()) limit : number,
        @Query('status', new DefaultValuePipe(STATUS.ALL), new ParseEnumPipe(STATUS)) status : STATUS,
        @Headers('user_id') userId
    ) {
        const borrows = await this.getBorrowsPresentation(await this.borrowService.getBorrows(userId, status, offset, limit), userId);
        return {
            status : 'success',
            response : borrows,
            metadata : {
                nextPage : borrows.length === limit ? `/borrows?offset=${offset + limit}&limit=${limit}` : undefined
            }
        }
    }

    @Get('/users/:userId/borrows')
    @SetMetadata('roles', [Role.ADMIN])
    async getBorrowsOfUser(
        @Param('userId') userId : string,
        @Query('offset' , new DefaultValuePipe(0), new ParseIntPipe()) offset : number,
        @Query('limit' , new DefaultValuePipe(60), new ParseIntPipe()) limit : number,
        @Query('status', new DefaultValuePipe(STATUS.ALL), new ParseEnumPipe(STATUS)) status : STATUS,
        @Headers('user_id') adminId
    ) {
        const borrows = await this.getBorrowsPresentation(await this.borrowService.getBorrows(userId, status, offset, limit), adminId);
        return {
            status : 'success',
            response : borrows,
            metadata : {
                nextPage : borrows.length === limit ? `/users/${userId}/borrows?offset=${offset + limit}&limit=${limit}` : undefined
            }
        }
    }



    @Post('/borrows/submissions')
    @SetMetadata('roles', [Role.ADMIN])
    async updateBorrow(
        @Query('bookInstanceId') bookInstanceId : string,
        @Headers('user_id') userId
    ) {
        await this.borrowService.markAsReturned(bookInstanceId);
        return {
            status : 'success',
            response : 'Borrow marked as returned'
        }
    }


    @Post('/borrows')
    @SetMetadata('roles', [Role.ADMIN])
    async createBorrow(
        @Headers('user_id') userId,
        @Body() body : CreateBorrowPayload
    ) {
        if(new Date().getTime() >= body.dueDate.getTime()) {
            throw new BadRequestException("Due date should be after now");
        }
        if(!await this.bookInstanceService.getById(body.bookInstanceId)) {
            throw new BadRequestException("Book instance with given does not exist");
        }
        const user = await this.userService.getUserByEmail(body.userEmail);
        if(!user) {
            throw new BadRequestException("Book instance with given does not exist");
        }
        const borrow = await this.borrowService.createBorrow({
            bookInstanceId : body.bookInstanceId,
            dueDate : body.dueDate,
            userId : user.id
        });
        return {
            status : 'success',
            response : await this.getBorrowRepresentation(borrow, userId)
        }
    }


    private async getBorrowsPresentation(borrows, userId : string) {
        return Promise.all(
            borrows.map(borrow => this.getBorrowRepresentation(borrow, userId))
        )
    }

    private async getBorrowRepresentation(borrow, userId : string) {
        let bookInstance = null;
        try {
            bookInstance = await this.bookInstanceService.getById(borrow.bookInstanceId);
        } catch(err) {
            if(!(err instanceof NotFoundException)) {
                throw err;
            }
        }
        const book = bookInstance ? await this.bookService.findBookById(bookInstance.bookId, userId) : null;
        return {
            ..._.pick(borrow, 'id', 'status', 'bookInstanceId', 'dueDate', 'returnDate', 'createDate'),
            book
        }
    }

}
