import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import 'dotenv/config';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import { TwitterService } from './twitter.service';
import { TweetV2 } from 'twitter-api-v2';
import { ResponseSchema } from './dtos';

@Injectable()
export class UpdaterService {
    private queue: string[] = [];
    private index: number = 0;
    constructor(
        @InjectModel() private readonly knex: Knex,
        private readonly twitterService: TwitterService
    ) { }

    async init() {
        const tweets = await this.knex.table('tweets').orderBy('created_at', 'desc').returning('tweet_id').limit(10).offset(0);
        for (const tweet of tweets) {
            this.queue.push(tweet.tweet_id);
            // console.log(tweet.tweet_id);
        }
    }
    getHello(): string {
        return 'Hello World!';
    }

    addToQueue(id: string) {
        console.log("addToQueue() " + id);
        this.queue.push(id);
        if (this.queue.length > 10) this.queue.shift();
    }

    @Interval(5000)
    async update() {
        console.log("update time! ");
        if (this.queue.length > 0) {
            console.log("update() " + this.index + this.queue[this.index]);
            let tweet  : ResponseSchema<TweetV2>= await this.twitterService.tweet(this.queue[this.index]);
            if (tweet.ok) {
                await this.knex.table('tweets')
                    .where('tweet_id', tweet.ok.data.id)
                    .increment('likes', tweet.ok.data.public_metrics.like_count)
                    .increment('retweets', tweet.ok.data.public_metrics.retweet_count)
                    .then(result => {
                        console.log("update() ok: " + result)
                        this.index++;
                        if (this.index >= this.queue.length) this.index = 0
                    })
                    .catch(err => {
                        console.log("update() db err: " + err)
                    });
            }
            else {
                console.log("update() twitter err: " + tweet.err.message);
            }
        }
    }
}