import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User & mongoose.Document;

export enum Role {
    ADMIN = 'admin',
    USER = 'user'
}

@Schema({})
export class Session {
    @Prop({ type: String, required : true })
    refreshToken: string

    @Prop({ type: String, default : null })
    fcmToken: string
}

export const SessionSchema = SchemaFactory.createForClass(Session);

const googleUrlGetter = value => {
    const chunks = value.split('=') ;
    chunks[chunks.length - 1] = 's300-c'
    return chunks.join('=');
}

@Schema({
    timestamps: {
        createdAt: 'createDate',
        updatedAt: 'updateDate',
    },
    toObject: {
        getters: true,
    },
})
export class User {
    id: string;

    @Prop({ type: String, required: true, unique : true })
    email: string;

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, default : false, get : googleUrlGetter })
    profileImageUrl: string;

    @Prop({ type: String, enum: ['admin', 'user'], required : true })
    role: Role

    @Prop({ type: [SessionSchema], required : true })
    sessions : Session[]

    @Prop()
    createDate: Date;

    @Prop()
    updateDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);