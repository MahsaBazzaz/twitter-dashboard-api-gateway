import { Injectable, NotFoundException } from '@nestjs/common';
import { TweetDto } from './tweetDto';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { TwitterService } from './twitter-microservice/twitter-microservice.service';

@Injectable()
export class AppService {
  constructor(@InjectModel() 
  private readonly knex: Knex,
  private readonly twitterService: TwitterService) { }

  getHello(): string {
    return 'Hello World!';
  }

  async getTweetById(id: string) {
    if (!id) {
      throw new NotFoundException(`tweet ${id} does not exist`);
    }
    // const t = await this.knex.raw(`SELECT * FROM TWEETS WHERE TWEET_ID = ${id}`);
    const t = await this.knex.table('tweets').where('tweet_id', id);
    return t;
  }

  async getTweetsByUsername(username: string) {
    if (!username) {
      throw new NotFoundException(`user ${username} does not exist`);
    }
    const t = await this.knex.table('tweets').where('username', username);
    return t;
  }

  async getAllTweets() {
    const t = await this.knex.table('tweets');
    return t;
  }

  async searchTweetByKeyword(keyword: string) {
    if (!keyword) {
      throw new NotFoundException(`user ${keyword} does not exist`);
    }
    const t = await this.knex.table('tweets').whereLike('text', `%${keyword}%`);
    return t;
  }

  async addUser(username: string) {
    if (!username) {
      throw new NotFoundException(`user ${username} does not exist`);
    }
    const ifExist = await this.twitterService.getTwitterUsername(username);
    console.log(ifExist)
    // if (ifExist) {
    //   const t = await this.knex.table('target_users').insert([{'user_id': 1}]);
    // }
  }
}
