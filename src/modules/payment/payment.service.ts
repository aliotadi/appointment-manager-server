// src/zarinpal/zarinpal.service.ts
import {
  Injectable,
  HttpException,
  HttpStatus,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as ZarinpalCheckout from 'zarinpal-checkout';
import { PaymentEntity } from '../../db/models';
import { Repository } from 'typeorm';
import { BaseService } from '../../common/baseClasses';
import { PaymentStatus } from './types/payment-status.enum';
import { ORDER_STATUS } from '../order/types';
import { OrderService } from '../order/order.service';
import { Response } from 'express';

@Injectable()
export class PaymentService extends BaseService<PaymentEntity> {
  private zarinpal: ZarinpalCheckout.ZarinPalInstance;

  constructor(
    @InjectRepository(PaymentEntity)
    paymentRepository: Repository<PaymentEntity>,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
  ) {
    super(paymentRepository);
    const merchantId = process.env.ZARINPAL_MERCHANT_ID;
    const sandboxMode = process.env.ZARINPAL_SANDBOX == 'true';

    this.zarinpal = ZarinpalCheckout.create(merchantId, sandboxMode);
  }

  async createPayment(
    amount: number,
    description: string,
    orderId: number,
  ): Promise<ZarinpalCheckout.PaymentRequestOutput> {
    try {
      const response = await this.zarinpal.PaymentRequest({
        Amount: amount,
        CallbackURL: `${process.env.ZARINPAL_CALLBACK_URL}/${orderId}`,
        Description: description,
      });

      if (response.status !== 100) {
        throw new HttpException('Payment not created', HttpStatus.BAD_REQUEST);
      }

      return response;
    } catch (error) {
      throw new HttpException(
        error.message || 'Payment initiation failed',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyPayment(
    orderId: number,
    status: 'OK' | 'NOK',
    authority: string,
    res: Response,
  ): Promise<void> {
    try {
      const payment = await this.findOne({
        where: { orderId, authority },
        relations: { order: true },
      });
      const response = await this.zarinpal.PaymentVerification({
        Amount: payment.amount,
        Authority: authority,
      });

      if (response.status === -21) {
        throw new HttpException(
          'No payment found for this authority.',
          HttpStatus.NOT_FOUND,
        );
      }

      if (response.status !== 100 && response.status !== 101) {
        throw new HttpException('Payment not verified', HttpStatus.BAD_REQUEST);
      }

      console.log(response);

      await this.update(
        { id: payment.id },
        {
          status: PaymentStatus.VERIFIED,
          refID: `${(response as any).refId}`,
          gatewayData: { ...payment.gatewayData, ...response },
        },
      );

      await this.orderService.update(
        { id: orderId },
        { status: ORDER_STATUS.PAYMENT_DONE },
      );
    } catch (error) {
      console.log(error);
    } finally {
      res.redirect(`${process.env.clientPaymentCallbackUrl}/${status}`);
    }
  }
}
