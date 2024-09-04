import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailableTimeEntity } from '../../db/models';
import { AvailableTimeAdminController } from './controllers';
import { AvailableTimeService } from './available-time.service';

@Module({
  imports: [TypeOrmModule.forFeature([AvailableTimeEntity])],
  controllers: [AvailableTimeAdminController],
  providers: [AvailableTimeService],
})
export class AvailableTimeModule {}
