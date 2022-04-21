import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { HttpService } from '@nestjs/axios';
import { keyword, ResponseSchema, Tweet, User } from './dtos';
import { Cron } from '@nestjs/schedule';


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
    let completeUserData = new Array<User>();
    const users = await this.knex.table('target_users');
    for (const element of users) {
      const response = await this.getUsernameById(element.user_id);
      if (response.status)
        completeUserData.push({ id: element.id, user_id: element.user_id, user_name: response.data });
    }
    return {
      status: true,
      data: completeUserData
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
    const tweets = await this.knex.table('target_users').whereLike('user_id', `%${username}%`);
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
    const response = await this.httpService.get('http://127.0.0.1:5000/addKeyword', { data: { "keyword": keyword } }).toPromise()
      .then((res) => {
        return res.data;
      });
    if (response.status) return { status: true, data: { id: response.data.id, word: keyword } }
    else return { status: false, data: response.data }
  }

  async removeKeyword(keyword: string): Promise<ResponseSchema<any>> {
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

  async sortTweetsByDate(): Promise<ResponseSchema<Tweet[]>> {
    const tweets = await this.knex.table('tweets').orderBy('created_at', 'desc');
    return {
      status: true,
      data: tweets
    }
  }

  async sortTweetsByLikes(): Promise<ResponseSchema<Tweet[]>> {
    const tweets = await this.knex.table('tweets').orderBy('likes', 'desc');
    return {
      status: true,
      data: tweets
    }
  }

  async sortTweetsByRetweets(): Promise<ResponseSchema<Tweet[]>> {
    const tweets = await this.knex.table('tweets').orderBy('retweets', 'desc');
    return {
      status: true,
      data: tweets
    }
  }

}

