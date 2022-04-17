import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MICROSERVICE_TOKEN } from '../../constants';

@Injectable()
export class TwitterService {
    private cn = 'TwitterService';

    /**
    * constructor
    * @private
    */
    constructor(
        @Inject(MICROSERVICE_TOKEN.TWITTER) private client: ClientProxy,
    ) { }

    /**
    * this is client.send 
    * @private
    * @param cmd - ´string´.
    * @param payload - ´TReq´.
    */
    async chapar<TReq, TRes>(cmd: string, payload: TReq): Promise<TRes> {
        return this.client.send(cmd, payload).toPromise();
    }

    async getTwitterUsername(twitter_id : string)
        : Promise<any> {
            return "Hello";
    }
}

