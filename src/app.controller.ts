import { Body, Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { TweetDto } from './tweetDto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/getTweetById")
  getTweet(@Body('id') id : string): any {
    console.log(id);
    return this.appService.getTweetById(id);
  }

  @Get("getTweetsByUsername")
  getTweetsByUsername(@Body('username') username : string): any {
    return this.appService.getTweetsByUsername(username);
  }

  @Get("getAllTweets")
  getAllTweets(): any {
    return this.appService.getAllTweets();
  }

  @Get("serachTweetByKeyword")
  searchTweetByKeyword(@Body('keyword') keyword : string): any {
    return this.appService.searchTweetByKeyword(keyword);
  }

  @Get("addUser")
  addUser(@Body('username') username : string): any {
    return this.appService.addUser(username);
  }
}
