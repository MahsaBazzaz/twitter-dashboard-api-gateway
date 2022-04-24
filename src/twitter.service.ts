import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { HttpService } from '@nestjs/axios';
import { keyword, ResponseSchema, Token, TopUser, Tweet, TweetWithImage, User, UserByUsername } from './dtos';
import { TwitterApi, TwitterApiReadOnly } from 'twitter-api-v2';
import { ConfigService } from '@nestjs/config';
import 'dotenv/config';

@Injectable()
export class TwitterService {
    private twitterClient: TwitterApi;
    private readonly roClient: TwitterApiReadOnly;
    constructor(@InjectModel()
    private readonly configService: ConfigService,
        private httpService: HttpService) {
        // Instanciate with desired auth type (here's Bearer v2 auth)
        this.twitterClient = new TwitterApi(process.env.bearer_token);

        // Tell typescript it's a readonly app
        this.roClient = this.twitterClient.readOnly;

        // Play with the built in methods
    }

    getHello(): string {
        return 'Hello World!';
    }

    async userByUsername(username: string): Promise<ResponseSchema<UserByUsername>> {
        const response = await this.roClient.v2.userByUsername(username,
            {"user.fields" : ["created_at", "description", "entities", "id",
             "location", "name", "pinned_tweet_id", "profile_image_url",
              "protected", "public_metrics", "url", "username", "verified", "withheld"]});
        if (response.errors) {
            return { err: { message: response.errors[0].detail } }
        }
        if (response.data) {
            return { ok: { data: response.data } }
        }
    }
}