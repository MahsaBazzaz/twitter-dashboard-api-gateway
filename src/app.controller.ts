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

  @Get("getAllUsers")
  getAllUsers(): any {
    return this.appService.getAllUsers();
  }

  @Get("addUser")
  addUser(@Body('username') username : string): any {
    return this.appService.addUser(username);
  }

  @Get("removeUser")
  removeUser(@Body('username') username : string): any {
    return this.appService.removeUser(username);
  }

  @Get("getAllKeywords")
  getAllKeywords(): any {
    return this.appService.getAllKeywords();
  }

  @Get("addKeyword")
  addKeyword(@Body('keyword') keyword : string): any {
    return this.appService.addKeyword(keyword);
  }

  @Get("removeKeyword")
  removeKeyword(@Body('keyword') keyword : string): any {
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

  @Get("searchByKeyword")
  searchByKeyword(@Body('keyword') keyword : string): any {
    return this.appService.searchByKeyword(keyword);
  }
}
