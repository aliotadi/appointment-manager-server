import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TABLE_NAMES } from '../../common/types';
import { OrderEntity } from './order.entity';
import { PaymentStatus } from '../../modules/payment/types/payment-status.enum';

@Entity({ name: TABLE_NAMES.PAYMENTS, orderBy: { id: 'DESC' } })
export class PaymentEntity extends BaseEntity {
  @Column({ nullable: true })
  paymentDate: Date;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: true })
  refID: string; // Zarinpal reference ID

  @Column({ nullable: false })
  authority: string; // Zarinpal authority code

  @Column({ nullable: false, enum: PaymentStatus })
  status: PaymentStatus;

  @Column({ nullable: false })
  url: string;

  @Column({ type: 'json', nullable: true })
  gatewayData: Record<string, any>;

  @ManyToOne(() => OrderEntity, (order) => order.payments)
  @JoinColumn()
  order: OrderEntity;

  @Column()
  orderId: number;
}
