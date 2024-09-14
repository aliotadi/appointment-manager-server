import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TABLE_NAMES } from '../../common/types';
import { OrderEntity } from './order.entity';

@Entity({ name: TABLE_NAMES.PAYMENTS, orderBy: { id: 'DESC' } })
export class PaymentEntity extends BaseEntity {
  @Column({ nullable: false })
  paymentDate: Date;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: true })
  refID: string; // Zarinpal reference ID

  @Column({ nullable: true })
  authority: string; // Zarinpal authority code

  @Column({ nullable: false })
  status: string; // TODO: should be enum

  @Column({ type: 'json', nullable: true })
  gatewayData: Record<string, any>;

  @ManyToOne(() => OrderEntity, (order) => order.payments)
  @JoinColumn()
  order: OrderEntity;
}
