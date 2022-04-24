import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { keyword, ResponseSchema, Token, Tweet, User } from './dtos';
import { ReportService } from './report.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly reportService: ReportService) { }

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
  getTopUsers(): Promise<ResponseSchema<{ count: number; username: string; }[]>> {
    let from = new Date();
    var to = new Date();
    from.setHours(to.getHours() - 1);
    var fromTimezoneOffset = from.getTimezoneOffset() * 60000;
    var toTimezoneOffset = to.getTimezoneOffset() * 60000;
    return this.reportService.getTopUsers(new Date(from.getTime() - fromTimezoneOffset), new Date(to.getTime() - toTimezoneOffset));
  }

  @Get("getTopTweets")
  getTopTweets(): Promise<ResponseSchema<Tweet[]>> {
    return this.reportService.getTopTweets();
  }

  @Get("getTopKeywords")
  getTopKeywords(): Promise<ResponseSchema<{ word: string, count: number }[]>> {
    return this.reportService.getTopKeywords();
  }

  @Get("getTweetsTimeSeries")
  getTweetsTimeSeries(): Promise<ResponseSchema<{ count: number; hhour: number; }[]>> {
    return this.reportService.getTweetsTimeSeries();
  }

  @Get("getMostFrequestWords")
  getMostFrequestWords(): Promise<ResponseSchema<Token[]>> {
    return this.reportService.getMostFrequestWords();
  }

  // @Get("getHeros")
  // getHeros(): Promise<ResponseSchema<any>> {
  //   let t: ResponseSchema<any> = { status: true, data: [{ name: "mahsa1", id: 1 }, { name: "mahsa2", id: 2 }, { name: "mahsa3", id: 3 }] }
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       resolve(t);
  //     }, 300);
  //   });
  // }

}
