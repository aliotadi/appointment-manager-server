import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KavenegarApi } from 'kavenegar';

import { BaseService } from '../../common/baseClasses';
import { SmsEntity } from '../../db/models';
import { SMS_TYPE_ENUM } from './types';

@Injectable()
export class SmsService extends BaseService<SmsEntity> {
  private kApi = KavenegarApi({
    apikey: process.env.KAVENEGAR_API_KEY,
  });

  constructor(
    @InjectRepository(SmsEntity)
    smsModel: Repository<SmsEntity>,
  ) {
    super(smsModel);
  }

  async sendOtp(phoneNumber: string, otp: string): Promise<boolean> {
    const result: { response: any; status: number } = await new Promise(
      (resolve) => {
        this.kApi.VerifyLookup(
          {
            receptor: phoneNumber,
            token: otp,
            template: process.env.KAVENEGAR_OTP_TEMPLATE,
          },
          function (response, status) {
            resolve({ response, status });
          },
        );
      },
    );

    this.insert({
      content: otp,
      type: SMS_TYPE_ENUM.AUTH,
      gatewayData: result,
    });
    return result.status === 200;
  }
}
