import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { HttpService } from '@nestjs/axios';
import { keyword, ResponseSchema, Token, TopUser, Tweet, TweetWithImage, User } from './dtos';


@Injectable()
export class AppService {
  constructor(@InjectModel()
  private readonly knex: Knex,
    private httpService: HttpService) { }

  getHello(): string {
    return 'Hello World!';
  }

  // @Cron('45 * * * * *')
  // async handleCron() {
  //   const tweets = await this.getAllTweets();
  //   console.log(tweets);
  // }

  async getTweetById(id: string): Promise<ResponseSchema<Tweet>> {
    const tweets = await this.knex.table('tweets').where('tweet_id', id);
    if (tweets.length > 0) {
      return {
        status: true,
        data: tweets[0]
      }
    }
    else {
      return {
        status: false,
        data: null
      }
    }
  }

  async getTweetsByUsername(username: string): Promise<ResponseSchema<Tweet[]>> {
    const tweets = await this.knex.table('tweets').where('username', username);
    if (tweets.length > 0) {
      return {
        status: true,
        data: tweets
      }
    }
    else {
      return {
        status: false,
        data: null
      }
    }
  }

  async getAllTweets(): Promise<ResponseSchema<TweetWithImage[]>> {
    let res: TweetWithImage[] = [];
    const tweets = await this.knex.table('tweets');
    for (const tweet of tweets) {
      const users = await this.knex.table('target_users').where('username', tweet.username);
      res.push({
        id: tweet.id,
        tweet_id: tweet.tweet_id,
        username: tweet.username,
        user_id: tweet.user_id,
        text: tweet.text,
        likes: tweet.likes,
        retweets: tweet.retweets,
        created_at: tweet.created_at,
        image_url: users[0]?.image_url
      });
    }
    return {
      status: true,
      data: res
    }
  }

  async searchTweetByKeyword(keyword: string): Promise<ResponseSchema<Tweet[]>> {
    const tweets = await this.knex.table('tweets').whereLike('text', `%${keyword}%`);
    return {
      status: true,
      data: tweets
    }
  }

  async getAllUsers(): Promise<ResponseSchema<User[]>> {
    const users = await this.knex.table('target_users');
    return {
      status: true,
      data: users
    }
  }

  async getUsernameById(user_id: string): Promise<any> {
    const response = await this.httpService.get('http://127.0.0.1:5000/getUsernameById', { data: { "user_id": user_id } }).toPromise()
      .then((res) => {
        return res.data;
      });
    return response;
  }

  async addUser(username: string): Promise<ResponseSchema<User>> {
    const response = await this.httpService.get('http://127.0.0.1:5000/addUser', { data: { "username": username } }).toPromise()
      .then((res) => {
        console.log(res)
        return res.data;
      });
    if (response.status) return { status: true, data: response.data }
    else return { status: false, data: response.data }
  }

  async removeUser(username: string): Promise<ResponseSchema<any>> {
    const response = await this.httpService.get('http://127.0.0.1:5000/removeUser', { data: { "username": username } }).toPromise()
      .then((res) => {
        return res.data;
      });
    if (response.status) return { status: true, data: response.data }
    else return { status: false, data: response.data }
  }

  async searchUser(username: string): Promise<ResponseSchema<Tweet[]>> {
    const tweets = await this.knex.table('target_users').whereLike('username', `%${username}%`);
    return {
      status: true,
      data: tweets
    }
  }

  async getAllKeywords(): Promise<ResponseSchema<keyword[]>> {
    const keywords = await this.knex.table('keywords');
    return {
      status: true,
      data: keywords
    }
  }

  async addKeyword(keyword: string): Promise<ResponseSchema<keyword>> {
    // let res: ResponseSchema<any>;
    // await this.knex.table('keywords').insert()
    //   .then(function (resp) {
    //     res.status = true;
    //   })
    //   .catch(function (err) {
    //     res.status = false;
    //   });
    // return res;
    const response = await this.httpService.get('http://127.0.0.1:5000/addKeyword', { data: { "keyword": keyword } }).toPromise()
      .then((res) => {
        return res.data;
      });
    if (response.status) return { status: true, data: { id: response.data.id, word: keyword } }
    else return { status: false, data: response.data }
  }

  async removeKeyword(keyword: string): Promise<ResponseSchema<any>> {
    // let res: ResponseSchema<any>;
    // await this.knex('keywords')
    //   .where('word', keyword)
    //   .del()
    //   .then(function (resp) {
    //     res.status = true;
    //   })
    //   .catch(function (err) {
    //     res.status = false;
    //   });
    // return res;
    const response = await this.httpService.get('http://127.0.0.1:5000/removeKeyword', { data: { "keyword": keyword } }).toPromise()
      .then((res) => {
        return res.data;
      });
    if (response.status) return { status: true, data: response.data }
    else return { status: false, data: response.data }
  }

  async searchKeyword(keyword: string): Promise<ResponseSchema<Tweet[]>> {
    const tweets = await this.knex.table('keywords').whereLike('word', `%${keyword}%`);
    return {
      status: true,
      data: tweets
    }
  }

  async sortTweetsByDate(order: boolean): Promise<ResponseSchema<Tweet[]>> {
    let by: string;
    order ? by = 'desc' : 'asc';
    const tweets = await this.knex.table('tweets').orderBy('created_at', by);
    return {
      status: true,
      data: tweets
    }
  }

  async sortTweetsByLikes(order: boolean): Promise<ResponseSchema<Tweet[]>> {
    let by: string;
    order ? by = 'desc' : 'asc';
    const tweets = await this.knex.table('tweets').orderBy('likes', by);
    return {
      status: true,
      data: tweets
    }
  }

  async sortTweetsByRetweets(order: boolean): Promise<ResponseSchema<Tweet[]>> {
    let by: string;
    order ? by = 'desc' : 'asc';
    const tweets = await this.knex.table('tweets').orderBy('retweets', by);
    return {
      status: true,
      data: tweets
    }
  }

  // async getTopUsers(from, to): Promise<ResponseSchema<{ count: number; username: string }[]>> {
  //   let res: TopUser[] = [];
  //   const data = await this.knex.select(this.knex.raw(`COUNT(*) as count, username FROM tweets GROUP BY username`)).orderByRaw(`count DESC`).limit(3);
  //   for (const d of data) {
  //     const user_image = await this.knex.table('target_users').where('username', d.username).returning('image_url');
  //     res.push({ username: d.username, count: d.count, image_url: user_image[0].image_url });
  //   }
  //   return {
  //     status: true,
  //     data: res
  //   }
  // }

  // async getTopTweets(): Promise<ResponseSchema<Tweet[]>> {
  //   let res: TweetWithImage[] = [];
  //   const tweets = await this.knex.table('tweets').orderBy([{ column: 'likes', order: 'desc' }, { column: 'retweets', order: 'desc' }]).limit(3);
  //   for (const tweet of tweets) {
  //     const users = await this.knex.table('target_users').where('username', tweet.username);
  //     res.push({
  //       id: tweet.id,
  //       tweet_id: tweet.tweet_id,
  //       username: tweet.username,
  //       user_id: tweet.user_id,
  //       text: tweet.text,
  //       likes: tweet.likes,
  //       retweets: tweet.retweets,
  //       created_at: tweet.created_at,
  //       image_url: users[0]?.image_url
  //     });
  //   }
  //   return {
  //     status: true,
  //     data: res
  //   }

  // }

  // async getTopKeywords(): Promise<ResponseSchema<{ word: string, count: number }[]>> {
  //   console.log("request received");
  //   let freqs: { word: string, count: number }[] = [];
  //   let response: { word: string, count: number }[] = [];
  //   let keywords: keyword[] = await this.knex.table('keywords');

  //   for (const keyword of keywords) {
  //     // let data = await this.knex.raw(`SELECT COUNT(*) FROM tweets WHERE text LIKE ${keyword.word}`);
  //     const data: number = await this.knex.table('tweets').whereLike('text', `%${keyword.word}%`).count();
  //     freqs.push({ word: keyword.word, count: data });
  //   }
  //   freqs.sort(function (a, b) { return a.count - b.count })
  //   freqs.forEach(elem => {
  //     response.push({ "word": elem.word, "count": elem.count })
  //   })
  //   return { status: true, data: response.slice(0, 3) };
  // }

  // async getTweetsTimeSeries(): Promise<ResponseSchema<{ count: number, hhour: number }[]>> {
  //   console.log("request received");
  //   const data = await this.knex.raw("SELECT COUNT(*), extract(hour from created_at) as hhour FROM tweets WHERE created_at >= current_date at time zone 'UTC' - interval '7 days' GROUP BY hhour ORDER BY hhour");
  //   return {
  //     status: true,
  //     data: data.rows
  //   }
  // }

  // async getMostFrequestWords(): Promise<ResponseSchema<Token[]>> {
  //   console.log("request received");
  //   const tokens = await this.knex.table('tokens').orderBy('count', 'desc').limit(50);
  //   return {
  //     status: true,
  //     data: tokens
  //   }
  // }
}

