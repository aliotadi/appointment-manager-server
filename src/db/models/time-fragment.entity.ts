import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { TABLE_NAMES } from '../../common/types';
import { AvailableTimeEntity } from './available-time.entity';

@Entity({ name: TABLE_NAMES.TIME_FRAGMENTS, orderBy: { id: 'DESC' } })
export class TimeFragmentEntity extends BaseEntity {
  @Column({ nullable: false })
  length: number;

  @Column({ nullable: false })
  rest: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  price: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: false })
  additionalPricePerPersonPercentage: number;

  @OneToMany(
    () => AvailableTimeEntity,
    (availableTime) => availableTime.timeFragment,
  )
  @JoinColumn()
  availableTimes: AvailableTimeEntity[];
}
