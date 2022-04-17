import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { HttpService } from '@nestjs/axios';
import { keyword, ResponseSchema, Tweet, User } from './dtos';


@Injectable()
export class AppService {
  constructor(@InjectModel()
  private readonly knex: Knex,
    private httpService: HttpService) { }

  getHello(): string {
    return 'Hello World!';
  }

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
    // TODO: make data in python code 
    // TODO: test
    let completeUserData: User[];
    const users = await this.knex.table('target_users');
    users.forEach(async (element) => {
      const response = await this.httpService.get('http://127.0.0.1:5000/getUsernameById', { data: { "id": element.user_id } }).toPromise()
        .then((res) => {
          return res.data;
        });
      if (response.status) completeUserData.push({ id: element.id, user_id: element.user_id, user_name: response.data });
    });
    return {
      status: true,
      data: completeUserData
    }
  }

  async addUser(username: string): Promise<ResponseSchema<User>> {
    // TODO: make status in python code true/false and with message
    // TODO: test
    const response = await this.httpService.get('http://127.0.0.1:5000/addUser', { data: { "username": username } }).toPromise()
      .then((res) => {
        return res.data;
      });
    if (response.status) return { status: true, data: { id: response.data.id, user_id: response.data.user_id, user_name: username } }
    else return { status: false, data: null }
  }

  async removeUser(username: string): Promise<ResponseSchema<object>> {
    // TODO: test
    const response = await this.httpService.get('http://127.0.0.1:5000/removeUser', { data: { "username": username } }).toPromise()
      .then((res) => {
        return res.data;
      });
    if (response.status) return { status: true, data: null }
    else return { status: false, data: null }
  }

  async getAllKeywords(): Promise<ResponseSchema<keyword[]>> {
    const keywords = await this.knex.table('keywords');
    return {
      status: true,
      data: keywords
    }
  }

  async addKeyword(keyword: string): Promise<ResponseSchema<keyword>> {
    let response: ResponseSchema<keyword>;
    await this.knex.insert({ word: keyword }, ['id']).into('keywords')
      .then(function (resp) {
        response = {
          status: true,
          data: {
            id: resp[0],
            word: keyword
          }
        }
      })
      .catch(function (err) {
        response = {
          status: false,
          data: null
        }
      });
    return response;
  }

  async removeKeyword(keyword: string) {
    // TODO: return type
    const t = await this.knex.table('keywords').where([{ word: keyword }]).del();
    return t;
  }

  async sortTweetsByDate() {
    // TODO: return type
    const t = await this.knex.table('tweets').orderBy('created_at', 'desc');
    return t;
  }

  async sortTweetsByLikes() {
    // TODO: return type
    const t = await this.knex.table('tweets').orderBy('likes', 'desc');
    return t;
  }

  async sortTweetsByRetweets() {
    // TODO: return type
    const t = await this.knex.table('retweets').orderBy('likes', 'desc');
    return t;
  }

}

