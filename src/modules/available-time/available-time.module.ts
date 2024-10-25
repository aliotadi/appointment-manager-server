import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailableTimeEntity } from '../../db/models';
import { AvailableTimeAdminController } from './controllers';
import { AvailableTimeService } from './available-time.service';
import { TimeFragmentModule } from '../time-fragment/time-fragment.module';
import { AvailableTimesController } from './controllers/available-time.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AvailableTimeEntity]),
    TimeFragmentModule,
  ],
  controllers: [AvailableTimeAdminController, AvailableTimesController],
  providers: [AvailableTimeService],
  exports: [AvailableTimeService],
})
export class AvailableTimeModule {}
