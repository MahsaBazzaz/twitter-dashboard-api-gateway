import { Body, Controller, Get, Post } from '@nestjs/common';
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

  @Post("serachTweetByKeyword")
  searchTweetByKeyword(@Body('keyword') keyword: string): Promise<ResponseSchema<Tweet[]>> {
    console.log("search tweet by keyword");
    return this.appService.searchTweetByKeyword(keyword);
  }

  @Get("getAllUsers")
  getAllUsers(): Promise<ResponseSchema<User[]>> {
    console.log("request received");
    return this.appService.getAllUsers();
  }

  @Get("addUser")
  addUser(@Body('username') username: string): Promise<ResponseSchema<User>> {
    return this.appService.addUser(username);
  }

  @Get("removeUser")
  removeUser(@Body('username') username: string): Promise<ResponseSchema<any>> {
    return this.appService.removeUser(username);
  }

  @Post("searchUser")
  searchUser(@Body('username') username: string): Promise<ResponseSchema<any>> {
    console.log("search user account");
    return this.appService.searchUser(username);
  }

  @Get("getAllKeywords")
  getAllKeywords(): Promise<ResponseSchema<keyword[]>> {
    return this.appService.getAllKeywords();
  }

  @Post("addKeyword")
  addKeyword(@Body('keyword') keyword: string): Promise<ResponseSchema<keyword>> {
    return this.appService.addKeyword(keyword);
  }

  @Post("removeKeyword")
  removeKeyword(@Body('keyword') keyword: string): Promise<ResponseSchema<any>> {
    return this.appService.removeKeyword(keyword);
  }

  @Post("serachKeywords")
  searchKeyword(@Body('keyword') keyword: string): Promise<ResponseSchema<any>> {
    console.log("search keyword");
    return this.appService.searchKeyword(keyword);
  }

  @Get("sortTweetsByDate")
  sortTweetsByDate(): Promise<ResponseSchema<Tweet[]>> {
    return this.appService.sortTweetsByDate();
  }

  @Get("sortTweetsByLikes")
  sortTweetsByLikes(): Promise<ResponseSchema<Tweet[]>> {
    return this.appService.sortTweetsByLikes();
  }

  @Get("sortTweetsByRetweets")
  sortTweetsByRetweets(): Promise<ResponseSchema<Tweet[]>> {
    return this.appService.sortTweetsByRetweets();
  }

}
