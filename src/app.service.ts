import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { HttpService } from '@nestjs/axios';
import { keyword, ResponseSchema, Token, Tweet, User } from './dtos';
import { Cron } from '@nestjs/schedule';
import { stringify } from 'querystring';


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

  async getAllTweets(): Promise<ResponseSchema<Tweet[]>> {
    const tweets = await this.knex.table('tweets');
    return {
      status: true,
      data: tweets
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

  async getTopUsers(from, to): Promise<ResponseSchema<{ count: number; username: String }[]>> {
    console.log("request received");
    const data = await this.knex.raw(`SELECT COUNT(*), username FROM tweets GROUP BY username`);
    return {
      status: true,
      data: data.rows
    }
  }

  async getTopTweets(): Promise<ResponseSchema<Tweet[]>> {
    console.log("request received");
    const tweets = await this.knex.table('tweets').orderBy([{ column: 'likes', order: 'desc' }, { column: 'retweets', order: 'desc' }]).limit(10);
    return {
      status: true,
      data: tweets
    }
  }

  async getTweetsTimeSeries(): Promise<ResponseSchema<{ count: number, hhour: number }[]>> {
    console.log("request received");
    const data = await this.knex.raw("SELECT COUNT(*), extract(hour from created_at) as hhour FROM tweets WHERE created_at >= current_date at time zone 'UTC' - interval '7 days' GROUP BY hhour ORDER BY hhour");
    return {
      status: true,
      data: data.rows
    }
  }

  async getMostFrequestWords(): Promise<ResponseSchema<Token[]>> {
    console.log("request received");
    const tokens = await this.knex.table('tokens').orderBy('count', 'desc').limit(50);
    return {
      status: true,
      data: tokens
    }
  }
}

