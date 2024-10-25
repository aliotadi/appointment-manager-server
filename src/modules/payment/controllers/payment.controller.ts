import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentService } from '../payment.service';
import { Response } from 'express';

@Controller('/payments')
@ApiTags('/payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get(':orderId')
  async placeOrder(
    @Param('orderId') orderId: number,
    @Query('Status') status: 'OK' | 'NOK',
    @Query('Authority') authority: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.paymentService.verifyPayment(orderId, status, authority, res);
  }
}
