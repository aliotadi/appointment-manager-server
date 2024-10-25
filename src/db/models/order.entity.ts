import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { TABLE_NAMES } from '../../common/types';
import { AvailableTimeEntity } from './available-time.entity';
import { ORDER_STATUS } from '../../modules/order/types';
import { PaymentEntity } from './payment.entity';
import { UserEntity } from './user.entity';

@Entity({ name: TABLE_NAMES.ORDERS, orderBy: { id: 'DESC' } })
export class OrderEntity extends BaseEntity {
  @Column({ nullable: false })
  basePrice: number;

  @Column({ nullable: false })
  additionalPrice: number;

  @Column({ nullable: false })
  totalPrice: number;

  @ManyToOne(() => AvailableTimeEntity, (availableTime) => availableTime.order)
  @JoinColumn()
  availableTime: AvailableTimeEntity;

  @Column({ nullable: false })
  availableTimeId: number;

  @OneToMany(() => PaymentEntity, (payment) => payment.order)
  payments: PaymentEntity[];

  @Column({ type: 'enum', nullable: false, enum: ORDER_STATUS })
  status: ORDER_STATUS;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn()
  user: UserEntity;

  @Column({ nullable: false })
  userId: number;
}
