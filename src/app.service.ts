import { HttpServer, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { HttpService } from '@nestjs/axios';


@Injectable()
export class AppService {
  constructor(@InjectModel() 
  private readonly knex: Knex,
  private httpService: HttpService) { }

  getHello(): string {
    return 'Hello World!';
  }

  async getTweetById(id: string) {
    if (!id) {
      throw new NotFoundException(`tweet ${id} does not exist`);
    }
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
    const response = await this.httpService.get(`localhost://5000/getIdByUsername/`, {"username" : username}).toPromise()
    .then((res) => {
      return res.data;
    });
    if (response.status == "ok") {
      const t = await this.knex.table('target_users').insert([{'user_id': response.data}]);
    }
  }
}
