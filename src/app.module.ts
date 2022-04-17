import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from 'nest-knexjs';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TwitterService } from './twitter.service';

@Module({
  imports: [
    KnexModule.forRoot({
      config: {
        client: 'pg',
        version: '5.7',
        useNullAsDefault: true,
        connection: {
          host: '127.0.0.1',
          port: 5444,
          user: 'enterprisedb',
          password: '20170111',
          database: 'twitter',
        },
      },
    }),
    ConfigModule.forRoot(),
    HttpModule
  ],
  controllers: [AppController],
  providers: [AppService,TwitterService],
})
export class AppModule { }
