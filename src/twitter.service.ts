import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { map, Observable } from 'rxjs';
// import * as dotenv from 'dotenv';
// import * as path from 'path';
import {ConfigService } from '@nestjs/config';

// const envFilePath = path.resolve(__dirname + './../.env');
// dotenv.config({ path: envFilePath });

@Injectable()
export class TwitterService {
    constructor(private httpService: HttpService, private configService : ConfigService) { }

    async ifUserExists(username: string): Promise<boolean> {
        
        if (!username) {
            throw new NotFoundException(`user ${username} does not exist`);
        }
        const response = await this.httpService.get('https://api.twitter.com/2/users/by/username/:username', 
        { headers: {"Authorization" : `Bearer ${this.configService.get<string>('bearer_token')}`}, 
        params: {
            "username": username
    } }).toPromise();
        return response.data;
    }
}