import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { keyword, ResponseSchema, Token, Tweet, User } from './dtos';

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

  @Post("addUser")
  addUser(@Body('username') username: string): Promise<ResponseSchema<User>> {
    return this.appService.addUser(username);
  }

  @Post("removeUser")
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

  @Post("sortTweetsByDate")
  sortTweetsByDate(@Body('order') order: boolean): Promise<ResponseSchema<Tweet[]>> {
    console.log("sort by date : " + order);
    return this.appService.sortTweetsByDate(order);
  }

  @Post("sortTweetsByLikes")
  sortTweetsByLikes(@Body('order') order: boolean): Promise<ResponseSchema<Tweet[]>> {
    console.log("sort by likes : " + order);
    return this.appService.sortTweetsByLikes(order);
  }

  @Post("sortTweetsByRetweets")
  sortTweetsByRetweets(@Body('order') order: boolean): Promise<ResponseSchema<Tweet[]>> {
    console.log("sort by retweets : " + order);
    return this.appService.sortTweetsByRetweets(order);
  }

  @Get("getTopUsers")
  getTopUsers(): Promise<ResponseSchema<{ count: number; username: String; }[]>> {
    let from = new Date();
    var to = new Date();
    from.setHours(to.getHours() - 1);
    var fromTimezoneOffset = from.getTimezoneOffset() * 60000;
    var toTimezoneOffset = to.getTimezoneOffset() * 60000;
    return this.appService.getTopUsers(new Date(from.getTime() - fromTimezoneOffset), new Date(to.getTime() - toTimezoneOffset));
  }

  @Get("getTopTweets")
  getTopTweets(): Promise<ResponseSchema<Tweet[]>> {
    return this.appService.getTopTweets();
  }

  @Get("getTweetsTimeSeries")
  getTweetsTimeSeries(): Promise<ResponseSchema<{ count: number; hhour: number; }[]>> {
    return this.appService.getTweetsTimeSeries();
  }

  @Get("getMostFrequestWords")
  getMostFrequestWords(): Promise<ResponseSchema<Token[]>> {
    return this.appService.getMostFrequestWords();
  }

}
