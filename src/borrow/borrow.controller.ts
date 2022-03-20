import {
    BadRequestException,
    Body,
    Controller, DefaultValuePipe, Delete, forwardRef, Get, Headers, Inject, NotFoundException, Param, ParseIntPipe,
    Post, Put, Query,
    SetMetadata,
} from '@nestjs/common';
import {Role} from "../user/model/user";
import {BorrowService, UpdateBorrowPayload} from "./borrow.service";
import {BookInstanceService} from "../book/book-instance.service";
import {UserService} from "../user/user.service";
import {IsDateString, IsNotEmpty, IsString} from "class-validator";
import {Transform, TransformFnParams} from "class-transformer";


export class CreateBorrowPayload {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    userEmail : string

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    bookInstanceId : string

    @IsDateString()
    dueDate : Date
}


@Controller("/borrows")
export class BorrowController {


    @Inject(forwardRef(() => BookInstanceService))
    private readonly bookInstanceService : BookInstanceService

    constructor(
        private readonly borrowService : BorrowService,
        private readonly userService : UserService
    ) {}


    @Get('/')
    @SetMetadata('roles', [Role.USER])
    async getBorrows(
        @Query('offset' , new DefaultValuePipe(0), new ParseIntPipe()) offset : number,
        @Query('limit' , new DefaultValuePipe(60), new ParseIntPipe()) limit : number,
        @Headers('user_id') userId
    ) {
        const borrows = await this.borrowService.getBorrows(userId, offset, limit);
        return {
            status : 'success',
            response : borrows,
            metadata : {
                nextPage : borrows.length === limit ? `/borrows?offset=${offset + limit}&limit=${limit}` : undefined
            }
        }
    }

    @Post('/')
    @SetMetadata('roles', [Role.ADMIN])
    async createBorrow(
        @Headers('user_id') userId,
        @Body() body : CreateBorrowPayload
    ) {
        if(!await this.bookInstanceService.getInstancesByBookId(body.bookInstanceId)) {
            throw new BadRequestException("Book instance with given does not exist");
        }
        const user = await this.userService.getUserByEmail(body.userEmail);
        if(!user || user.role !== Role.USER) {
            throw new BadRequestException("Book instance with given does not exist");
        }
        const borrow = await this.borrowService.createBorrow({
            bookInstanceId : body.bookInstanceId,
            dueDate : body.dueDate,
            userId : user.id
        });
        return {
            status : 'success',
            response : borrow
        }
    }

    @Post('/submissions')
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


}
