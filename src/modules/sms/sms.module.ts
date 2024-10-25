import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsService } from './sms.service';
import { SmsEntity } from '../../db/models';

@Module({
  imports: [TypeOrmModule.forFeature([SmsEntity])],
  controllers: [],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
