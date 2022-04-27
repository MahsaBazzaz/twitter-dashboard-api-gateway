import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { HttpService } from '@nestjs/axios';
import { keyword, ResponseSchema, Token, TopUser, Tweet, TweetWithImage } from './dtos';

@Injectable()
export class ReportService {
  constructor(@InjectModel()
  private readonly knex: Knex) { }

  getHello(): string {
    return 'Hello World!';
  }

  async getTopUsers(from, to): Promise<ResponseSchema<{ count: number; username: string, image_url: string }[]>> {
    let res: TopUser[] = [];
    const data = await this.knex.select(this.knex.raw(`COUNT(*) as count, user_id FROM tweets GROUP BY user_id`)).orderByRaw(`count DESC`).limit(10);
    for (const d of data) {
      const user = await this.knex.table('users').where('user_id', d.user_id);
      if (user.length > 0)
        res.push({ username: user[0].username, count: d.count, image_url: user[0].image_url });
    }
    return {
      ok: {
        data: res
      }
    }
  }

  async getTopTweets(): Promise<ResponseSchema<Tweet[]>> {
    let res: TweetWithImage[] = [];
    const tweets = await this.knex.table('tweets').orderBy([{ column: 'likes', order: 'desc' }, { column: 'retweets', order: 'desc' }]).limit(10);
    for (const tweet of tweets) {
      const users = await this.knex.table('users').where('user_id', tweet.user_id);
      if (users.length > 0) {
        res.push({
          id: tweet.id,
          tweet_id: tweet.tweet_id,
          username: users[0]?.username,
          user_id: tweet.user_id,
          text: tweet.text,
          likes: tweet.likes,
          retweets: tweet.retweets,
          created_at: tweet.created_at,
          image_url: users[0]?.image_url
        });
      }
    }
    return {
      ok: {
        data: res
      }
    }
  }

  async getTopKeywords(): Promise<ResponseSchema<{ word: string, count: number }[]>> {
    let freqs: { word: string, count: number }[] = [];
    let response: { word: string, count: number }[] = [];
    let keywords: keyword[] = await this.knex.table('keywords');

    for (const keyword of keywords) {
      // let data = await this.knex.raw(`SELECT COUNT(*) FROM tweets WHERE text LIKE ${keyword.word}`);
      const data: number = await this.knex.table('tweets').whereLike('text', `%${keyword.word}%`).count();
      freqs.push({ word: keyword.word, count: data });
    }
    freqs.sort(function (a, b) { return a.count - b.count })
    freqs.forEach(elem => {
      response.push({ "word": elem.word, "count": elem.count })
    })
    return { ok: { data: response.slice(0, 10) } };
  }

  async getTweetsTimeSeries(): Promise<ResponseSchema<{ count: number, hhour: number }[]>> {
    const data = await this.knex.raw("SELECT COUNT(*), extract(hour from created_at) as hhour FROM tweets WHERE created_at >= current_date at time zone 'UTC' - interval '7 days' GROUP BY hhour ORDER BY hhour");
    return {
      ok: {
        data: data.rows
      }
    }
  }

  async getMostFrequestWords(): Promise<ResponseSchema<Token[]>> {
    const tokens = await this.knex.table('tokens').orderBy('count', 'desc').limit(50);
    return {
      ok: {
        data: tokens
      }
    }
  }
}