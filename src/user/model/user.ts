import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User & mongoose.Document;

@Schema({})
export class Session {
    @Prop({ type: String, required : true })
    refreshToken: string

    @Prop({ type: String, required : true })
    fcmToken: string
}

export const SessionSchema = SchemaFactory.createForClass(Session);

@Schema({
    timestamps: {
        createdAt: 'create_date',
        updatedAt: 'update_date',
    },
    toObject: {
        getters: true,
    },
})
export class User {
    id: string;

    @Prop({ type: String, required: true })
    email: string;

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, default : false })
    profileImageUrl: string;

    @Prop({ type: String, enum: ['admin', 'user'], required : true })
    role: string

    @Prop({ type: [SessionSchema], required : true })
    sessions : Session[]

    @Prop()
    create_date: Date;

    @Prop()
    update_date: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);