import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { TweetStream, TweetV1, TweetV2SingleStreamResult, TwitterApi, TwitterApiReadOnly } from 'twitter-api-v2';
import { Cron } from '@nestjs/schedule';
import { ResponseSchema } from './dtos';
import 'dotenv/config';
import { InjectModel } from 'nest-knexjs';
import { NlpService } from './nlp.service';
import { UpdaterService } from './updater.service';
import { TwitterService } from './twitter.service';
import { AppService } from './app.service';

@Injectable()
export class CrawlerService {
    private twitterClient: TwitterApi;
    private readonly roClient: TwitterApiReadOnly;
    private streamFilter: TweetStream<TweetV1>;
    private stream: TweetStream<TweetV2SingleStreamResult>;

    constructor(
        @InjectModel() private readonly knex: Knex,
        private readonly nplService: NlpService,
        private readonly updaterService: UpdaterService,
        private readonly appService: AppService
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

    async streamV1(): Promise<any> {
        let users: ResponseSchema<string[]> = await this.getAllUserIds();
        let keywords: ResponseSchema<string[]> = await this.getAllKeywords();
        if (users.ok && keywords.ok) {
            this.streamFilter = await this.roClient.v1.filterStream({
                follow: users.ok.data, tweet_mode: 'extended', format: 'detailed'
                // track: keywords.ok.data, 
                // 'filter_level': 'medium'
            });

        }

        // You can also use async iterator to iterate over tweets!
        for await (const data of this.streamFilter) {
            console.log("data received");
            this.processTweet(data);
        }
    }

    async restartStream() {
        // Be sure to close the stream where you don't want to consume data anymore from it
        this.streamFilter.close();
        // await this.streamV1();
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
                return { ok: { data: result } };
            })
            .catch(err => {
                return { err: { message: err } };
            });
        return response;
    }

    async processTweet(tweet: any) {
        let id: string;
        let text: string;
        let username: string;
        let created_at: string;
        let user_id: string;
        let likes: number;
        let retweets: number
        if (tweet.retweeted_status != undefined) {
            id = tweet.retweeted_status.id_str;
            tweet.retweeted_status?.extended_tweet != undefined ? text = tweet.retweeted_status.extended_tweet.full_text : text = tweet.retweeted_status.text;
            username = tweet.retweeted_status.user.screen_name;
            created_at = tweet.retweeted_status.created_at;
            user_id = tweet.retweeted_status.user.id_str;
            likes = tweet.retweeted_status.favorite_count;
            retweets = tweet.retweeted_status.retweet_count;
        }
        else {
            id = tweet.id_str;
            tweet?.extended_tweet != undefined ? text = tweet.extended_tweet.full_text : text = tweet.text;
            username = tweet.user.screen_name;
            created_at = tweet.created_at;
            user_id = tweet.user.id_str;
            likes = tweet.favorite_count;
            retweets = tweet.retweet_count;
        }
        console.log(text);
        await this.knex.table('tweets').where('tweet_id', id)
            .then(async (result) => {
                if (result.length <= 0) {
                    let tokens: string[] = await this.nplService.getTokens(text);
                    let stems: string[] = [];
                    for (const element of tokens) {
                        stems.push(await this.nplService.stem(element));
                    }
                    const keywords = await this.getAllKeywords();
                    const tokensIntersectionWithEnStopwords = tokens.filter(value => keywords.ok.data.includes(value));
                    const stemsIntersectionWithEnStopwords = stems.filter(value => keywords.ok.data.includes(value));
                    if (tokensIntersectionWithEnStopwords.length > 0 || stemsIntersectionWithEnStopwords.length > 0) {
                        this.updaterService.addToQueue(id);
                        await this.addTweet({ id: id, text: text, user_id: user_id, username: username, created_at: created_at, likes: likes, retweeted: retweets, query: tweet });
                        await this.updateTokenTable(tokens, text);
                        await this.addUserIfNotIncluded(username, user_id);
                    }
                }
                else {
                    console.log('tweet already exists');
                }
            })
            .catch(err => {
                console.log('processTweet()' + err);
            });

    }

    async addTweet(data: {
        id: string,
        text: string,
        user_id: string,
        username: string,
        created_at: string,
        likes: number,
        retweeted: number,
        query: any
    }) {
        await this.knex.table('tweets').insert(
            [{
                tweet_id: data.id,
                text: data.text,
                user_id: data.user_id,
                username: data.username,
                created_at: data.created_at,
                likes: data.likes,
                retweets: data.retweeted,
                query: data.query
            }], '*')
            .then(result => {
                console.log("addTweet() ok:" + result);
            })
            .catch(err => {
                console.log("addTweet() err:" + err);
            });
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
                // console.log("addToken() ok : " + token + " " + count)
            })
            .catch(err => {
                console.log("addToken() err: " + err)
            });
    }

    async updateToken(token: string, count: number) {
        await this.knex.table('tokens').increment('count', count).where('token', token)
            .then(result => {
                // console.log("updateToken() ok: " + token + " " + count)
            })
            .catch(err => {
                console.log("updateToken() err: " + err)
            });
    }

    async addUserIfNotIncluded(username: string, user_id) {
        let response = await this.knex.table('users').where('user_id', user_id)
            .then(result => {
                if (result.length <= 0) {
                    this.appService.addUser(username);
                }
            })
            .catch(err => {
                return { err: { message: err } };
            });
        return response;
    }
}