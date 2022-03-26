import {BadRequestException, Inject, Injectable} from "@nestjs/common";
import {OAuth2Client} from "google-auth-library";


type GoogleAccountInfo = {
    email : string,
    name : string,
    picture : string
}

@Injectable()
export class GoogleAccountService {

    private readonly client = new OAuth2Client();
    private readonly issPattern = /accounts.google.com$/;

    @Inject('GOOGLE_CLIENT_ID')
    private readonly clientId : string

    async getUserInfo(token : string) : Promise<GoogleAccountInfo> {
        const { email, name, picture, iss } = (await this.client.verifyIdToken({
            idToken : token,
            audience: this.clientId
        })).getPayload();

        if(!iss.match(this.issPattern)[0]) throw new BadRequestException('Token not from google account');

        return { name, email, picture };
    }

}