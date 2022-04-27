import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from 'nest-knexjs';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ReportService } from './report.service';
import { TwitterService } from './twitter.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICE_TOKEN } from '../constants';
require('dotenv').config({ path: '../.env' });

@Module({
  imports: [
    KnexModule.forRoot({
      config: {
        client: 'pg',
        version: '5.7',
        useNullAsDefault: true,
        connection: {
          host: '127.0.0.1',
          port: 5432,
          user: 'postgres',
          password: 'pa$$w0rd',
          database: 'twitter'
        },
        pool: {
          max: 5
        }
      },
    }),
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true
    }),
    HttpModule,
    ScheduleModule.forRoot(),
    ClientsModule.register([
      { name: MICROSERVICE_TOKEN.CRAWLER, transport: Transport.NATS },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ReportService,
    TwitterService,
  ],
})
export class AppModule { }
