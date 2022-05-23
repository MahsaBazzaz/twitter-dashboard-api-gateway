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
  getAllTweets(@Body('offset') offset: number, @Body('size') size: number): Promise<ResponseSchema<Tweet[]>> {
    return this.appService.getAllTweets(size, offset);
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
    this.appService.restartStream();
    return res;
  }

  @Post("removeUser")
  removeUser(@Body('username') username: string): Promise<ResponseSchema<any>> {
    let res = this.appService.removeUser(username);
    this.appService.restartStream();
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
    this.appService.restartStream();
    return res;
  }

  @Post("removeKeyword")
  async removeKeyword(@Body('keyword') keyword: string): Promise<ResponseSchema<any>> {
    let res = await this.appService.removeKeyword(keyword);
    this.appService.restartStream();
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
  getTweetsTimeSeries(): Promise<ResponseSchema<{ y: number, name: number }[]>> {
    return this.reportService.getTweetsTimeSeries();
  }

  @Get("getMostFrequestWords")
  getMostFrequestWords(): Promise<ResponseSchema<Token[]>> {
    return this.reportService.getMostFrequestWords();
  }

  @Get("getVerificationStatus")
  getVerifications(): Promise<ResponseSchema<{ name: string, y: number }[]>> {
    return this.reportService.getVerifications();
  }

  @Get("FollowingsCount")
  getFollowing(): Promise<ResponseSchema<number>> {
    return this.reportService.getFollowing();
  }

  @Get("FollowersCount")
  getFollowers(): Promise<ResponseSchema<number>> {
    return this.reportService.getFollowers();
  }

  @Get("tweetsCount")
  tweetsCount(): Promise<ResponseSchema<number>> {
    return this.reportService.tweetsCount();
  }

  @Get("yearsCount")
  yearsCount(): Promise<ResponseSchema<number>> {
    return this.reportService.yearsCount();
  }

  @Get("graphData")
  graphData(): Promise<ResponseSchema<string[]>> {
    return this.reportService.graphData();
  }
  //#endregion

}
