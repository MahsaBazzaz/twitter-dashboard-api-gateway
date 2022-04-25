import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { keyword, ResponseSchema, Token, TopUser, Tweet, TWeetById, TweetWithImage, User, UserByUsername } from './dtos';
import { TwitterApi, TwitterApiReadOnly } from 'twitter-api-v2';
import 'dotenv/config';

@Injectable()
export class CrawlerService {
    private twitterClient: TwitterApi;
    private readonly roClient: TwitterApiReadOnly;
    constructor(private readonly knex: Knex) {
        // (create a OAuth 1.0a client)
        this.twitterClient = new TwitterApi({ appKey: process.env.consumer_key, appSecret: process.env.consumer_secret });
        // Tell typescript it's a readonly app
        this.roClient = this.twitterClient.readOnly;
    }

    getHello(): string {
        return 'Hello World!';
    }

    async stream() {
        const streamFilter = await this.twitterClient.v1.filterStream({
            // See FilterStreamParams interface.
            track: 'JavaScript',
            follow: ['1842984n', '1850485928354'],
        });
    }


}