import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/baseClasses';
import { OrderEntity } from '../../db/models';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import {
  CreateOrderRequestDto,
  GetOrderResponseDto,
  GetOrdersAdminResponseDto,
  GetOrdersResponseDto,
  ORDER_STATUS,
} from './types';
import { plainToInstance } from 'class-transformer';
import { AvailableTimeService } from '../available-time/available-time.service';

@Injectable()
export class OrderService extends BaseService<OrderEntity> {
  constructor(
    @InjectRepository(OrderEntity) orderRepository: Repository<OrderEntity>,
    private readonly availableTimeService: AvailableTimeService,
  ) {
    super(orderRepository);
  }

  async getOrdersAdmin(
    date: Date = new Date(),
    page: number = 1,
    pageSize: number = 10,
  ): Promise<GetOrdersAdminResponseDto> {
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.repository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.availableTime', 'availableTime')
      .where('DATE(order.date) = DATE(:date)', { date }) // Compare only the date part
      .orderBy('order.id', 'DESC')
      .skip(skip)
      .take(pageSize);

    const [orders, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / pageSize);

    return plainToInstance(GetOrdersAdminResponseDto, {
      items: orders,
      total,
      page,
      pageSize,
      totalPages,
    });
  }

  async placeOrder(
    userId: number,
    createOrderDto: CreateOrderRequestDto,
  ): Promise<void> {
    const availableTime = await this.availableTimeService.findOne({
      where: { id: createOrderDto.availableTimeId },
      relations: { timeFragment: true },
    });

    // TODO: should get the sessions out of available time and check if the requested start & finish are available place the order ;)

    if (!availableTime) {
      throw new HttpException('Available time not found', HttpStatus.NOT_FOUND);
    }

    const order = new OrderEntity();
    order.start = createOrderDto.start;
    order.finish = createOrderDto.finish;
    order.basePrice = availableTime.timeFragment.price;
    order.additionalPrice =
      (order.basePrice /
        availableTime.timeFragment.additionalPricePerPersonPercentage) *
      createOrderDto.numberOfAdditionalParticipants;
    order.totalPrice = order.basePrice + order.additionalPrice;
    order.status = ORDER_STATUS.WAITING_PAYMENT;
    order.availableTimeId = createOrderDto.availableTimeId;
    order.userId = userId;

    await this.insert(order);
  }

  async cancelOrder(userId: number, orderId: number): Promise<void> {
    const order = await this.findOne({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    if (order.status === ORDER_STATUS.CANCELED) {
      throw new HttpException(
        'Order is already canceled',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.update(
      { id: orderId, userId: userId },
      { status: ORDER_STATUS.CANCELED },
    );
  }

  // 3. Get all Orders for a specific user with Pagination
  async getOrders(
    userId: number,
    date: Date,
    page: number,
    pageSize: number,
  ): Promise<GetOrdersResponseDto> {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const [orders, totalItems] = await this.findAndCount({
      where: {
        availableTime: { date: Between(startOfDay, endOfDay) },
        userId,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      items: plainToInstance(GetOrderResponseDto, orders),
      totalItems,
      totalPages,
      currentPage: page,
    };
  }

  async getOrderById(
    userId: number,
    orderId: number,
  ): Promise<GetOrderResponseDto> {
    const order = await this.findOne({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    return plainToInstance(GetOrderResponseDto, order);
  }
}
