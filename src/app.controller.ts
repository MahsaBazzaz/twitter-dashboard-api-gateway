import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { TwitterService } from './twitter.service';
import { ReportService } from './report.service';
import { keyword, ResponseSchema, Token, Tweet, TweetWithImage, User } from './dtos';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly reportService: ReportService,
    private readonly twitterService: TwitterService,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  //#region tweets
  @Get("/getTweetById")
  getTweetById(@Body('id') id: string): Promise<ResponseSchema<Tweet>> {
    return this.appService.getTweetById(id);
  }

  @Get("getTweetsByUsername")
  getTweetsByUsername(@Body('username') username: string): Promise<ResponseSchema<Tweet[]>> {
    return this.appService.getTweetsByUsername(username);
  }

  @Post("getAllTweets")
  getAllTweets(@Body('offset') offset: number): Promise<ResponseSchema<Tweet[]>> {
    return this.appService.getAllTweets(offset);
  }

  @Post("serachTweetByKeyword")
  searchTweetByKeyword(@Body('keyword') keyword: string): Promise<ResponseSchema<TweetWithImage[]>> {
    return this.appService.searchTweet(keyword);
  }

  @Post("sortTweetsByDate")
  sortTweetsByDate(@Body('order') order: boolean): Promise<ResponseSchema<Tweet[]>> {
    return this.appService.sortTweetsByDate(order);
  }

  @Post("sortTweetsByLikes")
  sortTweetsByLikes(@Body('order') order: boolean): Promise<ResponseSchema<Tweet[]>> {
    return this.appService.sortTweetsByLikes(order);
  }

  @Post("sortTweetsByRetweets")
  sortTweetsByRetweets(@Body('order') order: boolean): Promise<ResponseSchema<Tweet[]>> {
    return this.appService.sortTweetsByRetweets(order);
  }
  //#endregion
  //
  //
  //

  //#region users
  @Get("getAllUsers")
  getAllUsers(): Promise<ResponseSchema<User[]>> {
    return this.appService.getAllUsers();
  }

  @Post("addUser")
  async addUser(@Body('username') username: string): Promise<ResponseSchema<User>> {
    let res = await this.appService.addUser(username);
    // this.crawlerService.restartStream();
    return res;
  }

  @Post("removeUser")
  removeUser(@Body('username') username: string): Promise<ResponseSchema<any>> {
    let res = this.appService.removeUser(username);
    // this.crawlerService.restartStream();
    return res;
  }

  @Post("searchUser")
  searchUser(@Body('username') username: string): Promise<ResponseSchema<any>> {
    return this.appService.searchUser(username);
  }

  @Get("/getUserByUsername")
  getUserByUsername(@Body('username') username: string): any {
    return this.twitterService.userByUsername(username);
  }

  //#endregion
  //
  //
  //
  //#region keywords
  @Get("getAllKeywords")
  getAllKeywords(): Promise<ResponseSchema<keyword[]>> {
    return this.appService.getAllKeywords();
  }

  @Post("addKeyword")
  async addKeyword(@Body('keyword') keyword: string): Promise<ResponseSchema<keyword>> {
    let res = await this.appService.addKeyword(keyword);
    // this.crawlerService.restartStream();
    return res;
  }

  @Post("removeKeyword")
  async removeKeyword(@Body('keyword') keyword: string): Promise<ResponseSchema<any>> {
    let res = await this.appService.removeKeyword(keyword);
    // this.crawlerService.restartStream();
    return res;
  }

  @Post("serachKeywords")
  searchKeyword(@Body('keyword') keyword: string): Promise<ResponseSchema<any>> {
    return this.appService.searchKeyword(keyword);
  }
  //#endregion
  //
  //
  //
  //#region reports
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
  //#endregion

}
