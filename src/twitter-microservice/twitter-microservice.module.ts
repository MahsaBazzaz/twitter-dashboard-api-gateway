import { Module } from '@nestjs/common';
import { TwitterService } from './twitter-microservice.service';
import { MICROSERVICE_TOKEN } from '../../constants';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    providers: [
        TwitterService,
        {
            provide: MICROSERVICE_TOKEN.TWITTER,
            useFactory: (configService: ConfigService) => {
                return ClientProxyFactory.create({
                    transport: Transport.NATS
                });
            },
            inject: [ConfigService]
        }
    ],
    exports: [TwitterService]
})
export class TwitterModule { }
