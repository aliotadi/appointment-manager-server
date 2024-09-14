import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from '../../db/models';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
})
export class PaymentModule {}
