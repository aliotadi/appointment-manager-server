import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { TABLE_NAMES } from '../../common/types';
import { TimeFragmentEntity } from './time-fragment.entity';

@Entity({ name: TABLE_NAMES.AVAILABLE_TIMES, orderBy: { id: 'DESC' } })
export class AvailableTimeEntity extends BaseEntity {
  @Column({ nullable: false, type: 'date' })
  date: Date;

  @Column({ nullable: false, type: 'time' })
  start: string;

  @Column({ nullable: false, type: 'time' })
  finish: string;

  @ManyToOne(
    () => TimeFragmentEntity,
    (timeFragment) => timeFragment.availableTimes,
  )
  @JoinColumn()
  timeFragment: TimeFragmentEntity;

  @Column({ nullable: false })
  timeFragmentId: number;
}
