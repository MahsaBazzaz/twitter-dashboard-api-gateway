import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { keyword, ResponseSchema, Token, Tweet, TweetWithImage, User } from './dtos';
import { ReportService } from './report.service';
import { TwitterService } from './twitter.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly reportService: ReportService,
    private readonly twitterService: TwitterService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  //#region tweets
  @Get("/getTweetById")
  getTweetById(@Body('id') id: string): Promise<ResponseSchema<Tweet>> {
    return this.appService.getTweetById(id);
  }

  @Get("/getTweet")
  getTweet(@Body('id') id: string): Promise<ResponseSchema<Tweet>> {
    return this.twitterService.tweet(id);
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
  //#endregion
  //
  //
  //

  //#region users
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
