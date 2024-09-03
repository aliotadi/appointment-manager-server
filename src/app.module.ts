import * as dotenv from 'dotenv';

dotenv.config();

import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MorganInterceptor, MorganModule } from 'nest-morgan';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { redisOptions, typeOrmConfig } from './configs';
import { AuthModule, UserModule } from './modules';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    RedisModule.forRoot(redisOptions),
    MorganModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('dev'),
    },
  ],
})
export class AppModule {}
