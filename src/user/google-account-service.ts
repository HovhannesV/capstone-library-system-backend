import {Injectable} from "@nestjs/common";


type GoogleAccountInfo = {
    email : string,
    name : string,
    picture : string
}

@Injectable()
export class GoogleAccountService {

    async getUserInfo(token : string) : Promise<GoogleAccountInfo> {
        return {} as any;
    }

}