import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { keyword, ResponseSchema, Token, TopUser, Tweet, TWeetById, TweetWithImage, User, UserByUsername } from './dtos';
import { TweetV2, TweetV2LookupResult, TweetV2SingleResult, TwitterApi, TwitterApiReadOnly } from 'twitter-api-v2';
import 'dotenv/config';
import { HttpService } from '@nestjs/axios';
var Twitter = require('twitter');
import { AxiosResponse } from 'axios';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable()
export class TwitterService {
    private twitterClient: TwitterApi;
    private readonly roClient: TwitterApiReadOnly;

    // private readonly client;
    constructor(private readonly httpService: HttpService) {
        // Instanciate with desired auth type (here's Bearer v2 auth)
        this.twitterClient = new TwitterApi(process.env.bearer_token);
        // Tell typescript it's a readonly app
        this.roClient = this.twitterClient.readOnly;

        // this.client = new Twitter({
        //     consumer_key: process.env.consumer_key,
        //     consumer_secret: process.env.consumer_secret,
        //     bearer_token: process.env.bearer_token
        // });
    }

    getHello(): string {
        return 'Hello World!';
    }

    async userByUsername(username: string): Promise<ResponseSchema<any>> {
        const response = await this.roClient.v2.userByUsername(username,
            {
                "user.fields": ["created_at", "description", "entities", "id",
                    "location", "name", "pinned_tweet_id", "profile_image_url",
                    "protected", "public_metrics", "url", "username", "verified", "withheld"]
            });
        if (response.errors) {
            return { err: { message: response.errors[0].detail } }
        }
        if (response.data) {
            return { ok: { data: response.data } }
        }
        return null;
    }

    async tweet(id: string): Promise<any> {
        console.log(id);
        const response: TweetV2SingleResult = await this.roClient.v2.singleTweet(id
            ,
            {
                "tweet.fields": ["attachments", "author_id", "context_annotations", "conversation_id", "created_at",
                    "entities", "geo", "id", "in_reply_to_user_id", "lang", "public_metrics", "possibly_sensitive", "referenced_tweets",
                    "reply_settings", "source", "text", "withheld"],
            }
        );
        if (response.errors) {
            return { err: { message: response.errors[0].detail } }
        }
        if (response.data) {
            return { ok: { data: response.data[0] } }
        }
        // let response = await this.client.get(`https://api.twitter.com/2/tweets/${id}?`, {
        //     "expansions": "author_id,geo.place_id",
        //     "tweet.fields": "author_id,geo,id,public_metrics,source,text",
        //     "place.fields": "country_code,geo",
        //     "user.fields": "id,username,profile_image_url"
        // })
        //     .then(function (tweet) {
        //         return { ok: { data: tweet } }
        //     })
        //     .catch(function (error) {
        //         return { err: { message: error } }
        //     })
        // return response;

    }

}