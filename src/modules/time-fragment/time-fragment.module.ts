import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeFragmentEntity } from '../../db/models/time-fragment.entity';
import { TimeFragmentAdminController } from './controllers';
import { TimeFragmentService } from './time-fragment.service';

@Module({
  imports: [TypeOrmModule.forFeature([TimeFragmentEntity])],
  controllers: [TimeFragmentAdminController],
  providers: [TimeFragmentService],
})
export class TimeFragmentModule {}