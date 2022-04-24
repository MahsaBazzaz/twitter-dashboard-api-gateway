import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { HttpService } from '@nestjs/axios';
import { keyword, ResponseSchema, Token, TopUser, Tweet, TweetWithImage, User } from './dtos';
import { TwitterApi, TwitterApiReadOnly } from 'twitter-api-v2';

@Injectable()
export class TwitterService {
    private twitterClient: TwitterApi;
    private readonly roClient: TwitterApiReadOnly;
    constructor(@InjectModel()
    private readonly knex: Knex,
        private httpService: HttpService) {
        // Instanciate with desired auth type (here's Bearer v2 auth)
        this.twitterClient = new TwitterApi('<YOUR_APP_USER_TOKEN>');

        // Tell typescript it's a readonly app
        this.roClient = this.twitterClient.readOnly;

        // Play with the built in methods
    }

    getHello(): string {
        return 'Hello World!';
    }

    async getUser(username : string){
        const user = await this.roClient.v2.userByUsername(username);
    }

}