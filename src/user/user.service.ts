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
    private jwtSecret : string;

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
            this.jwtSecret,
            { expiresIn : 30 * 60 }
        );
    }

    createRefreshToken(jti : string) {
        return jwt.sign(
            { jti },
            this.jwtSecret
        );
    }

    extractJTI(refreshToken : string) {
        const { jti } = jwt.verify(refreshToken, this.jwtSecret);
        if(!jti) throw new BadRequestException("Invalid refresh token")
        return jti;
    }

    async getById(userId : string) {
        const user = await this.userModel.findOne({ _id : userId });
        if(!user) throw new NotFoundException("User not found");
        return user.toObject();
    }

    async getByRefreshToken(refreshToken : string) {
        const user = await this.userModel.findOne({ 'sessions.refreshToken' : refreshToken });
        if(!user) throw new NotFoundException("User not found");
        return user.toObject();
    }

    async updateUserSession(refreshToken : string, updatePayload : { fcmToken : string }) {
        const {matchedCount} = await this.userModel.updateOne({
            'sessions.refreshToken' : refreshToken
        }, {
            $set : {
                'sessions.$.fcmToken' : updatePayload.fcmToken
            }
        });
        if(matchedCount === 0) {
            throw new BadRequestException("Session with given refresh token does not exist");
        }
    }

    async removeSession(refreshToken : string) {
        const {matchedCount} = await this.userModel.updateOne({
            'sessions.refreshToken' : refreshToken
        }, {
            $pull : {
                sessions : {
                    refreshToken : refreshToken
                }
            }
        });
        if(matchedCount === 0) {
            throw new BadRequestException("Session with given refresh token does not exist");
        }
    }

    async getUsersByEmailPrefix(emailPrefix : string, offset : number, limit : number) {
        const filter = emailPrefix ? { email : { $regex : new RegExp(`^${emailPrefix}`) } } : {};

        return this.userModel.find(filter).sort({email : 1}).skip(offset).limit(limit);
    }


    async getUserByEmail(email : string) {
        const user = await this.userModel.findOne({ email : email });
        return user?.toObject();
    }

    async createUserByEmail(userInfo : UserInfo) {
        if(!this.emailDomainPatterns.some(pattern => !!userInfo.email.match(pattern)[0])) {
            throw new BadRequestException('Email domain is not part of the library');
        }
        const role = this.adminEmailPatterns.some(pattern => !!userInfo.email.match(pattern)?.[0]) ? 'admin' : 'user';

        return (await this.userModel.create({
            ...userInfo,
            profileImageUrl : userInfo.picture,
            role,
            sessions : [],
        })).toObject();
    }

    async addSession(id : string, refreshToken : string, fcmToken : string = null) {
        await this.userModel.updateOne({ _id : id }, {
            $push : {
                sessions : {
                    refreshToken,
                    fcmToken
                }
            }
        })
    }

}