import { Body, Controller, Get, Post } from '@nestjs/common';
import { TweetV1 } from 'twitter-api-v2';
import { AppService } from './app.service';
import { CrawlerService } from './crawler.service';
import { keyword, ResponseSchema, Token, Tweet, TweetWithImage, User } from './dtos';
import { NlpService } from './nlp.service';
import { ReportService } from './report.service';
import { TwitterService } from './twitter.service';
import { UpdaterService } from './updater.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly reportService: ReportService,
    private readonly twitterService: TwitterService,
    private readonly crawlerService: CrawlerService,
    private readonly nlpService: NlpService,
    private readonly updaterService: UpdaterService) {
    this.stream();
    this.updaterService.init();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Get("/tokenize")
  // tokenize(@Body('text') text: string): Promise<any> {
  //   return this.nlpService.tokenize(text);
  // }

  // @Get("/tokenizeAndStem")
  // async tokenizeAndStem(@Body('text') text: string): Promise<any> {
  //   const tweetTokens = await this.nlpService.tokenize(text);
  //   let stems: string[] = [];
  //   for (const element of tweetTokens) {
  //     stems.push(await this.nlpService.stem(element));
  //   }
  //   return stems;
  // }

  // @Get("/stream")
  stream() {
    this.crawlerService.streamV1();
  }

  // @Get("/process")
  // processTweet(@Body('tweet') tweet: TweetV1): Promise<any> {
  //   return this.crawlerService.processTweet(tweet);
  // }

  // @Get("/allTokens")
  // allTokens(): Promise<any> {
  //   return this.crawlerService.getAllTokens();
  // }

  // @Get("/updateTokenTable")
  // updateTokenTable(): Promise<any> {
  //   let tokens = ["security"];
  //   let text = "this is a tweet containing security";
  //   return this.crawlerService.updateTokenTable(tokens, text);
  // }

  //#region tweets
  @Get("/getTweetById")
  getTweetById(@Body('id') id: string): Promise<ResponseSchema<Tweet>> {
    return this.appService.getTweetById(id);
  }

  @Get("/getTweet")
  getTweet(@Body('id') id: string): Promise<ResponseSchema<any>> {
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
