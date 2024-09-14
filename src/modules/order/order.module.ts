import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../../db/models';
import { OrderService } from './order.service';
import { OrderAdminController } from './controllers';
import { AvailableTimeModule } from '../available-time/available-time.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), AvailableTimeModule],
  controllers: [OrderAdminController],
  providers: [OrderService],
})
export class OrderModule {}
