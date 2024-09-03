import { Column, Entity } from 'typeorm';

import { BaseEntity } from './base.entity';
import { TABLE_NAMES } from '../../common/types';

@Entity({ name: TABLE_NAMES.USERS, orderBy: { id: 'DESC' } })
export class UserEntity extends BaseEntity {
  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false, unique: true })
  phoneNumber: string;

  @Column({ default: false })
  phoneNumberVerified: boolean;

  @Column({ nullable: true })
  password: string;

  @Column({ default: false })
  isAdmin: boolean;
}
