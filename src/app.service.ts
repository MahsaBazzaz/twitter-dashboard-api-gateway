import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { HttpService } from '@nestjs/axios';
import { keyword, ResponseSchema, Token, TopUser, Tweet, TweetWithImage, User } from './dtos';
import { TwitterService } from './twitter.service';


@Injectable()
export class AppService {
  constructor(@InjectModel()
  private readonly knex: Knex,
    private httpService: HttpService,
    private twitterService: TwitterService) { }

  getHello(): string {
    return 'Hello World!';
  }

  async getTweetById(id: string): Promise<ResponseSchema<Tweet>> {
    const tweets = await this.knex.table('tweets').where('tweet_id', id);
    if (tweets) {
      return {
        ok: {
          data: tweets[0]
        }
      }
    }
    else {
      return {
        err: {
          message: 'db error'
        }
      }
    }
  }

  async getTweetsByUsername(username: string): Promise<ResponseSchema<Tweet[]>> {
    const tweets = await this.knex.table('tweets').where('username', username);
    if (tweets) {
      return {
        ok: {
          data: tweets
        }
      }
    }
    else {
      return {
        err: {
          message: 'db error'
        }
      }
    }
  }

  async getAllTweets(offset: number): Promise<ResponseSchema<TweetWithImage[]>> {
    let res: TweetWithImage[] = [];
    const tweets = await this.knex.table('tweets').orderBy('created_at', 'desc').limit(30).offset(offset); //TODO
    for (const tweet of tweets) {
      const users = await this.knex.table('users').where('user_id', tweet.user_id);
      if (users.length > 0) {
        res.push({
          id: tweet.id,
          tweet_id: tweet.tweet_id,
          username: users[0].username,
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

  async searchTweet(term: string): Promise<ResponseSchema<TweetWithImage[]>> {
    let res: TweetWithImage[] = [];
    const tweets = await this.knex.table('tweets').whereLike('text', `%${term}%`).orWhereLike('username', `%${term}%`);
    for (const tweet of tweets) {
      const users = await this.knex.table('users').where('username', tweet.username);
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
      ok: {
        data: res
      }
    }
  }

  async getAllUsers(): Promise<ResponseSchema<User[]>> {
    const users = await this.knex.table('users');
    return {
      ok: {
        data: users
      }
    }
  }

  async addUser(username: string): Promise<ResponseSchema<any>> {
    const user = await this.knex.table('users').where('username', username).returning('*');
    if (user.length > 0) {
      return { err: { message: 'user already exists' } }
    }
    else {
      let res = await this.twitterService.userByUsername(username);
      if (res.ok) {
        let response = await this.knex.table('users').insert(
          [{
            user_id: res.ok.data.id,
            username: username,
            name: res.ok.data.name,
            image_url: res.ok.data?.profile_image_url,
            verified: res.ok.data?.verified,
            location: res.ok.data?.location,
            url: res.ok.data?.url,
            protected: res.ok.data?.protected,
            created_at: res.ok.data?.created_at,
            followers_count: res.ok.data?.public_metrics?.followers_count,
            following_count: res.ok.data?.public_metrics?.following_count,
            tweet_count: res.ok.data?.public_metrics?.tweet_count
          }], '*')
          .then(result => {
            return { ok: { data: result } }
          })
          .catch(err => {
            return { err: { message: err } }
          });
        return response;
      }
      else {
        return { err: { message: res.err.code } }
      }
    }
  }

  async removeUser(username: string): Promise<ResponseSchema<any>> {
    let response = await this.knex('users')
      .where('username', username)
      .del()
      .then(result => {
        if (result > 0) {
          return { ok: { data: result } }
        }
        else {
          return { err: { message: 'no user with this username' } }
        }
      })
      .catch(err => {
        return { err: { message: err } }
      });
    return response;
  }

  async searchUser(username: string): Promise<ResponseSchema<Tweet[]>> {
    const tweets = await this.knex.table('users').whereLike('username', `%${username}%`);
    return {
      ok: {
        data: tweets
      }
    }
  }

  async getAllKeywords(): Promise<ResponseSchema<keyword[]>> {
    const keywords = await this.knex.table('keywords');
    return {
      ok: {
        data: keywords
      }
    }
  }

  async addKeyword(keyword: string): Promise<ResponseSchema<any>> {
    const user = await this.knex.table('keywords').where('word', keyword.toLowerCase()).returning('*');
    if (user.length > 0) {
      return { err: { message: 'keyword already exists' } }
    }
    else {
      let response = await this.knex.table('keywords').insert([{ word: keyword.toLowerCase() }])
        .then(result => {
          return { ok: { data: result } }
        })
        .catch(err => {
          return { err: { message: err } }
        });
      return response;
    }

  }

  async removeKeyword(keyword: string): Promise<ResponseSchema<any>> {
    let response = await this.knex('keywords')
      .where('word', keyword.toLowerCase())
      .del()
      .then(result => {
        if (result > 0) {
          return { ok: { data: result } }
        }
        else {
          return { err: { message: 'no keyword with this word' } }
        }
      })
      .catch(err => {
        return { err: { message: err } }
      });
    return response;
  }

  async searchKeyword(keyword: string): Promise<ResponseSchema<Tweet[]>> {
    const tweets = await this.knex.table('keywords').whereLike('word', `%${keyword}%`);
    return {
      ok: {
        data: tweets
      }
    }
  }

  async sortTweetsByDate(order: boolean): Promise<ResponseSchema<TweetWithImage[]>> {
    let by: string;
    order ? by = 'desc' : by = 'asc';

    // const tweets = await this.knex.table('tweets').orderBy('created_at', by);
    // return {
    //   ok: {
    //     data: tweets
    //   }
    // }

    let res: TweetWithImage[] = [];
    const tweets = await this.knex.raw(`SELECT * FROM tweets WHERE tweet_id IN (SELECT tweet_id FROM tweets ORDER BY id DESC LIMIT 30) ORDER BY created_at ${by};`)
    for (const tweet of tweets.rows) {
      const users = await this.knex.table('users').where('user_id', tweet.user_id);
      if (users.length > 0) {
        res.push({
          id: tweet.id,
          tweet_id: tweet.tweet_id,
          username: users[0].username,
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

  async sortTweetsByLikes(order: boolean): Promise<ResponseSchema<TweetWithImage[]>> {
    let by: string;
    order ? by = 'desc' : by = 'asc';

    // const tweets = await this.knex.table('tweets').orderBy('likes', by);
    // return {
    //   ok: {
    //     data: tweets
    //   }
    // }

    let res: TweetWithImage[] = [];
    const tweets = await this.knex.raw(`SELECT * FROM tweets WHERE tweet_id IN (SELECT tweet_id FROM tweets ORDER BY id DESC LIMIT 30) ORDER BY likes ${by};`)
    for (const tweet of tweets.rows) {
      const users = await this.knex.table('users').where('user_id', tweet.user_id);
      if (users.length > 0) {
        res.push({
          id: tweet.id,
          tweet_id: tweet.tweet_id,
          username: users[0].username,
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

  async sortTweetsByRetweets(order: boolean): Promise<ResponseSchema<TweetWithImage[]>> {
    let by: string;
    order ? by = 'desc' : by = 'asc';
    // const tweets = await this.knex.table('tweets').orderBy('retweets', by);
    // return {
    //   ok: {
    //     data: tweets
    //   }
    // }

    let res: TweetWithImage[] = [];
    const tweets = await this.knex.raw(`SELECT * FROM tweets WHERE tweet_id IN (SELECT tweet_id FROM tweets ORDER BY id DESC LIMIT 30) ORDER BY retweets ${by};`)
    for (const tweet of tweets.rows) {
      const users = await this.knex.table('users').where('user_id', tweet.user_id);
      if (users.length > 0) {
        res.push({
          id: tweet.id,
          tweet_id: tweet.tweet_id,
          username: users[0].username,
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
}

