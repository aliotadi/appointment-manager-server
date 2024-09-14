import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { OrderService } from '../order.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JWT_STRATEGIES, JwtPayload } from '../../../common/types';
import { FormattedApiResponse, Payload } from '../../../common/decorators';
import {
  CreateOrderRequestDto,
  GetOrderResponseDto,
  GetOrdersResponseDto,
} from '../types';

@Controller('/orders')
@ApiTags('/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AuthGuard(JWT_STRATEGIES.JWT))
  @ApiBearerAuth('access-token')
  @FormattedApiResponse()
  async placeOrder(
    @Payload() user: JwtPayload,
    @Body() createOrderDto: CreateOrderRequestDto,
  ) {
    return await this.orderService.placeOrder(user.id, createOrderDto);
  }

  @Patch('/cancel/:id')
  @UseGuards(AuthGuard(JWT_STRATEGIES.JWT))
  @ApiBearerAuth('access-token')
  @FormattedApiResponse()
  async cancelOrder(@Payload() user: JwtPayload, @Param('id') orderId: number) {
    await this.orderService.cancelOrder(user.id, orderId);
  }

  @Get()
  @UseGuards(AuthGuard(JWT_STRATEGIES.JWT))
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'date', required: false, type: Date })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @FormattedApiResponse(GetOrdersResponseDto)
  async getOrders(
    @Payload() user: JwtPayload,
    @Query('date') date: Date = new Date(),
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<GetOrdersResponseDto> {
    return this.orderService.getOrders(user.id, date, page, pageSize);
  }

  @Get(':id')
  @UseGuards(AuthGuard(JWT_STRATEGIES.JWT))
  @ApiBearerAuth('access-token')
  @FormattedApiResponse(GetOrderResponseDto)
  async getOrderById(
    @Payload() user: JwtPayload,
    @Param('id') id: number,
  ): Promise<GetOrderResponseDto> {
    return this.orderService.getOrderById(user.id, id);
  }
}
