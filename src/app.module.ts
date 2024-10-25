import * as dotenv from 'dotenv';

dotenv.config();

import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { MorganInterceptor, MorganModule } from 'nest-morgan';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { redisOptions, typeOrmConfig } from './configs';
import {
  AuthModule,
  AvailableTimeModule,
  OrderModule,
  PaymentModule,
  SmsModule,
  TimeFragmentModule,
  UserModule,
} from './modules';
import { ResponseFormatterInterceptor } from './common/interceptors/response-formatter';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    RedisModule.forRoot(redisOptions),
    MorganModule,
    UserModule,
    AuthModule,
    AvailableTimeModule,
    TimeFragmentModule,
    OrderModule,
    PaymentModule,
    SmsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: ResponseFormatterInterceptor },
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('dev'),
    },
  ],
})
export class AppModule {}
