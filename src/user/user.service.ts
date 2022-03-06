import {BadRequestException, Inject, Injectable, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "./model/user";
import {Model} from "mongoose";

import * as jwt from 'jsonwebtoken'

type UserInfo = {
    email : string,
    name : string,
    picture : string
}


@Injectable()
export class UserService {

    @InjectModel(User.name)
    private userModel : Model<UserDocument>

    @Inject('JWT_SECRET')
    private jwtToken : string;

    private emailDomainPatterns : RegExp[];
    private adminEmailPatterns : RegExp[];


    constructor(@Inject('EMAIL_DOMAIN_PATTERNS') emailDomainPatterns : string[],
                @Inject('ADMIN_EMAIL_PATTERNS') adminEmailPatterns : string[]) {
        this.emailDomainPatterns = emailDomainPatterns.map(str => new RegExp(str));
        this.adminEmailPatterns = adminEmailPatterns.map(str => new RegExp(str));
    }

    generateToken(id : string, role : string) {
        return jwt.sign(
            { id : id, role : role },
            this.jwtToken,
            { expiresIn : 10 * 60 }
        );
    }

    async getById(userId : string) {
        const user = await this.userModel.findOne({ id : userId });
        if(!user) throw new NotFoundException("User not found");
        return user.toObject();
    }

    async getByRefreshToken(refreshToken : string) {
        const user = await this.userModel.findOne({ refreshTokens : refreshToken });
        if(!user) throw new NotFoundException("User not found");
        return user.toObject();
    }

    async updateRefreshToken(oldRefreshToken : string, newRefreshToken : string) {
        await this.userModel.updateOne({
            refreshTokens : oldRefreshToken
        }, {
            $pull : {
                refreshTokens : oldRefreshToken
            },
            $push : {
                refreshTokens : newRefreshToken
            }
        });
    }

    async removeRefreshToken(refreshToken : string) {
        await this.userModel.updateOne({
            refreshTokens : refreshToken
        }, {
            $pull : {
                refreshTokens : refreshToken
            }
        });
    }

    async getUserByEmail(email : string) {
        const user = await this.userModel.findOne({ email : email });
        return user?.toObject();
    }

    async createUserByEmail(userInfo : UserInfo) {
        if(!this.emailDomainPatterns.some(pattern => !!userInfo.email.match(pattern)[0])) {
            throw new BadRequestException('Email domain is not part of the library');
        }
        const role = this.adminEmailPatterns.some(pattern => !!userInfo.email.match(pattern)[0]) ? 'admin' : 'user';

        return (await this.userModel.create({
            ...userInfo,
            profileImageUrl : userInfo.picture,
            role,
            refreshTokens : [],
        })).toObject();
    }

    async addRefreshToken(id : string, refreshToken : string) {
        await this.userModel.updateOne({id}, {
            $push : {
                refreshTokens : refreshToken
            }
        })
    }

}