import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from 'nest-knexjs';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
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
      },
    }),
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true
    }),
    HttpModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
