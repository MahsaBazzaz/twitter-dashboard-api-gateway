import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { TweetStream, TweetV1, TweetV2SingleStreamResult, TwitterApi, TwitterApiReadOnly } from 'twitter-api-v2';
import { Cron } from '@nestjs/schedule';
import { ResponseSchema } from './dtos';
import 'dotenv/config';
import { InjectModel } from 'nest-knexjs';
import { NlpService } from './nlp.service';

@Injectable()
export class CrawlerService {
    private twitterClient: TwitterApi;
    private readonly roClient: TwitterApiReadOnly;
    private streamFilter: TweetStream<TweetV1>;
    private stream: TweetStream<TweetV2SingleStreamResult>;

    constructor(
        @InjectModel() private readonly knex: Knex,
        private readonly nplService: NlpService
    ) {
        // (create a OAuth 1.0a client)
        this.twitterClient = new TwitterApi({
            appKey: process.env.API_Key,
            appSecret: process.env.API_Key_Secret,
            accessToken: process.env.Access_Token,
            accessSecret: process.env.Access_Token_Secret
        });

        // Instanciate with desired auth type (here's Bearer v2 auth)
        // this.twitterClient = new TwitterApi(process.env.bearer_token);
        // Tell typescript it's a readonly app
        this.roClient = this.twitterClient.readOnly;
    }

    getHello(): string {
        return 'Hello World!';
    }

    // @Cron('45 * * * * *')
    // update() {
    // }

    async streamV1(): Promise<any> {
        let users: ResponseSchema<string[]> = await this.getAllUserIds();
        let keywords: ResponseSchema<string[]> = await this.getAllKeywords();
        if (users.ok && keywords.ok) {
            this.streamFilter = await this.roClient.v1.filterStream({ follow: users.ok.data });
            //track: keywords.ok.data, 'filter_level': 'medium'
        }

        // You can also use async iterator to iterate over tweets!
        for await (const data of this.streamFilter) {
            console.log("data received: " + data.text);
            this.processTweet(data);
        }
    }

    async streamV2(): Promise<any> {
        let users: ResponseSchema<string[]> = await this.getAllUserIds();
        let keywords: ResponseSchema<string[]> = await this.getAllKeywords();
        let keywordsRule: string = keywords.ok.data.join(" OR has:");
        let usersRule: string = users.ok.data.join(" OR has:");
        console.log(keywordsRule);
        if (users.ok && keywords.ok) {
            // const addedRules = await this.roClient.v2.updateStreamRules({
            //     add: [
            //       { value: 'JavaScript', tag: 'js' },
            //       { value: 'TypeScript', tag: 'ts' },
            //     ],
            //   });

            const addedRules = await this.roClient.v2.updateStreamRules({
                add: [
                    {
                        value: '"twitter data" has: ' + keywordsRule
                        //  + " from: " + usersRule + " -is:tweet" 
                    },
                ]
            })
            this.stream = await this.roClient.v2.searchStream();
        }
    }


    async getAllUserIds(): Promise<ResponseSchema<string[]>> {
        let response = await this.knex.table('users').select('user_id')
            .then(result => {
                let res: string[] = []
                for (const userid of result) {
                    res.push(userid.user_id)
                }
                return { ok: { data: res } };
            })
            .catch(err => {
                return { err: { message: err } };
            });
        return response;
    }

    async getAllKeywords(): Promise<ResponseSchema<string[]>> {
        let response = await this.knex.table('keywords').returning('word')
            .then(result => {
                let res: string[] = []
                for (const keyword of result) {
                    res.push(keyword.word)
                }
                return { ok: { data: res } };
            })
            .catch(err => {
                return { err: { message: err } };
            });
        return response;
    }

    async getAllTokens(): Promise<ResponseSchema<{ token: string }[]>> {
        let response = await this.knex.table('tokens').returning('token')
            .then(result => {
                // let res: string[] = []
                // for (const token of result) {
                //     res.push(token.token)
                // }
                return { ok: { data: result } };
            })
            .catch(err => {
                return { err: { message: err } };
            });
        return response;
    }

    // async tokenize(text: string): Promise<string[]> {
    //     return removeStopwords(text.toLowerCase().replace(/[^a-zA-Z ]/g, "").split(' '), en)
    // }

    async processTweet(tweet: TweetV1) {
        const t = await this.knex.table('tweets').where('tweet_id', tweet.id);
        if (t.length <= 0) {
            const tweetTokens = await this.nplService.tokenize(tweet.text);
            let stems: string[] = [];
            for (const element of tweetTokens) {
                stems.push(await this.nplService.stem(element));
            }
            const keywords = await this.getAllKeywords();
            const tokensIntersectionWithEnStopwords = tweetTokens.filter(value => keywords.ok.data.includes(value));
            if (tokensIntersectionWithEnStopwords.length > 0) {
                await this.addTweet(tweet);
                await this.updateTokenTable(tweetTokens, tweet.text);
            }
        }
        else {
            console.log('tweet already exists');
        }
    }

    async addTweet(tweet: TweetV1) {
        let response = await this.knex.table('tweets').insert(
            [{
                text: tweet.text,
                username: tweet.user.screen_name,
                created_at: tweet.created_at,
                user_id: tweet.user.id,
                tweet_id: tweet.id,
                likes: tweet.favorite_count,
                retweets: tweet.retweet_count
            }], '*')
            .then(result => {
                return { ok: { data: result } }
            })
            .catch(err => {
                return { err: { message: err } }
            });
        console.log("addTweet() " + response);
    }

    async updateTokenTable(tweetTokens: string[], text: string) {
        const allTokens = await this.getAllTokens();
        for (let i = 0; i < tweetTokens.length; i++) {
            const tokensIntersectionWithAllTokens = allTokens.ok.data.find(x => x.token == tweetTokens[i]);
            var count = (text.match(tweetTokens[i]) || []).length;
            if (tokensIntersectionWithAllTokens != undefined) {
                await this.updateToken(tweetTokens[i], count);
            }
            else {
                await this.addToken(tweetTokens[i], count);
            }
        }
    }

    async addToken(token: string, count: number) {
        let response = await this.knex.table('tokens').insert(
            [{
                token: token,
                count: count
            }], '*')
            .then(result => {
                console.log("addToken() ok : " + token + " " + count)
            })
            .catch(err => {
                console.log("addToken() err: " + err)
            });
        console.log("addToken() " + response);
    }

    async updateToken(token: string, count: number) {
        await this.knex.table('tokens').increment('count', count).where('token', token)
            .then(result => {
                console.log("updateToken() ok: " + token + " " + count)
            })
            .catch(err => {
                console.log("updateToken() err: " + err)
            });
    }
}