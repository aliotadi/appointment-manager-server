import { Column, Entity } from 'typeorm';

import { BaseEntity } from './base.entity';
import { TABLE_NAMES } from '../../common/types';
import { TIME_FRAGMENT } from '../../modules/available-time/types';

@Entity({ name: TABLE_NAMES.AVAILABLE_TIMES, orderBy: { id: 'DESC' } })
export class AvailableTimeEntity extends BaseEntity {
  @Column({ nullable: false })
  start: Date;

  @Column({ nullable: false })
  finish: Date;

  @Column({ nullable: false, enum: TIME_FRAGMENT, type: 'enum' })
  allowedFragment: TIME_FRAGMENT;

  @Column({ nullable: false })
  restTime: number;
}
