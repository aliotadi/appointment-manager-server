import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { TABLE_NAMES } from '../../common/types';
import { TimeFragmentEntity } from './time-fragment.entity';
import { OrderEntity } from './order.entity';

@Entity({ name: TABLE_NAMES.AVAILABLE_TIMES, orderBy: { id: 'DESC' } })
export class AvailableTimeEntity extends BaseEntity {
  @Column({ nullable: false, type: 'date' })
  date: Date;

  @Column({ nullable: false, type: 'int' })
  start: number;

  @Column({ nullable: false, type: 'int' })
  finish: number;

  @ManyToOne(
    () => TimeFragmentEntity,
    (timeFragment) => timeFragment.availableTimes,
  )
  @JoinColumn()
  timeFragment: TimeFragmentEntity;

  @Column({ nullable: false })
  timeFragmentId: number;

  @OneToMany(() => OrderEntity, (order) => order.availableTime)
  @JoinColumn()
  orders: OrderEntity[];
}
