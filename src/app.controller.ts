import { Body, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { keyword, ResponseSchema, Tweet, User } from './dtos';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/getTweetById")
  getTweet(@Body('id') id: string): Promise<ResponseSchema<Tweet>> {
    return this.appService.getTweetById(id);
  }

  @Get("getTweetsByUsername")
  getTweetsByUsername(@Body('username') username: string): Promise<ResponseSchema<Tweet[]>> {
    return this.appService.getTweetsByUsername(username);
  }

  @Get("getAllTweets")
  getAllTweets(): Promise<ResponseSchema<Tweet[]>> {
    return this.appService.getAllTweets();
  }

  @Get("serachTweetByKeyword")
  searchTweetByKeyword(@Body('keyword') keyword: string): Promise<ResponseSchema<Tweet[]>> {
    return this.appService.searchTweetByKeyword(keyword);
  }

  @Get("getAllUsers")
  getAllUsers(): Promise<ResponseSchema<User[]>> {
    return this.appService.getAllUsers();
  }

  @Get("addUser")
  addUser(@Body('username') username: string): Promise<ResponseSchema<User>> {
    return this.appService.addUser(username);
  }

  @Get("removeUser")
  removeUser(@Body('username') username: string): Promise<ResponseSchema<object>> {
    return this.appService.removeUser(username);
  }

  @Get("getAllKeywords")
  getAllKeywords(): Promise<ResponseSchema<keyword[]>> {
    return this.appService.getAllKeywords();
  }

  @Get("addKeyword")
  addKeyword(@Body('keyword') keyword: string): Promise<ResponseSchema<keyword>> {
    return this.appService.addKeyword(keyword);
  }

  @Get("removeKeyword")
  removeKeyword(@Body('keyword') keyword: string): any {
    return this.appService.removeKeyword(keyword);
  }

  @Get("sortTweetsByDate")
  sortTweetsByDate(): any {
    return this.appService.sortTweetsByDate();
  }

  @Get("sortTweetsByLikes")
  sortTweetsByLikes(): any {
    return this.appService.sortTweetsByLikes();
  }

  @Get("sortTweetsByRetweets")
  sortTweetsByRetweets(): any {
    return this.appService.sortTweetsByRetweets();
  }

}
