import {
    BadRequestException,
    CanActivate,
    ExecutionContext, HttpException, Inject,
    Injectable, UnauthorizedException
} from '@nestjs/common';
import {UserService} from "./user.service";
import {Reflector} from "@nestjs/core";
import * as jwt from 'jsonwebtoken'
import {Role} from "./model/user";



@Injectable()
export class AuthGuard implements CanActivate {

    @Inject('JWT_SECRET')
    private jwtSecret : string;

    constructor(private userService: UserService,
                private reflector: Reflector) {}


    public async canActivate(context: ExecutionContext): Promise<boolean> {
        if(this.reflector.get<string>('auth', context.getHandler()) === 'none') return true;

        const requestObj = context.switchToHttp().getRequest();
        const authToken = requestObj.headers.authorization;
        if(!authToken) {
            throw new BadRequestException('auth token not present');
        }
        try {
            const { role, id } = jwt.verify(authToken, this.jwtSecret);

            const roles = this.reflector.get<string>('roles', context.getHandler()) || [Role.USER, Role.ADMIN]

            if(!roles.includes(role)) throw new BadRequestException('The endpoint is not designed for the role');

            requestObj.headers.user_id = id;
            requestObj.headers.role =  role;
            return true;
        } catch(ex) {
            if(ex instanceof HttpException) {
                throw ex;
            }
            throw new UnauthorizedException();
        }
    }
}
