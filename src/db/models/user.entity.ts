import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { TABLE_NAMES } from '../../common/types';
import { OrderEntity } from './order.entity';

@Entity({ name: TABLE_NAMES.USERS, orderBy: { id: 'DESC' } })
export class UserEntity extends BaseEntity {
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: false, unique: true })
  phoneNumber: string;

  @Column({ default: false })
  phoneNumberVerified: boolean;

  @Column({ nullable: true })
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];
}
