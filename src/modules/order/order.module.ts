import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../../db/models';
import { OrderService } from './order.service';
import { OrderAdminController } from './controllers';
import { AvailableTimeModule } from '../available-time/available-time.module';
import { PaymentModule } from '../payment/payment.module';
import { OrderController } from './controllers/order.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    AvailableTimeModule,
    PaymentModule,
  ],
  controllers: [OrderAdminController, OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
