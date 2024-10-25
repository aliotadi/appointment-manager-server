import { Column, Entity } from 'typeorm';
import { TABLE_NAMES } from '../../common/types';
import { BaseEntity } from './base.entity';
import { SMS_TYPE_ENUM } from '../../modules/sms/types';

@Entity({ name: TABLE_NAMES.SMSes, orderBy: { id: 'DESC' } })
export class SmsEntity extends BaseEntity {
  @Column()
  content: string;

  @Column()
  type: SMS_TYPE_ENUM;

  @Column({ type: 'jsonb' })
  gatewayData: Record<string, any>;
}
