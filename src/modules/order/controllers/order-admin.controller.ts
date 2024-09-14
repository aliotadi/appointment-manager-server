import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { JWT_STRATEGIES, USER_ROLE } from '../../../common/types';
import { RolesGuard } from '../../../common/guards';
import { FormattedApiResponse, Roles } from '../../../common/decorators';
import { GetOrdersAdminResponseDto } from '../types';
import { OrderService } from '../order.service';

@Controller('/admin/orders')
@ApiTags('/admin/orders')
export class OrderAdminController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(AuthGuard(JWT_STRATEGIES.JWT), RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'date', required: false, type: Date })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @FormattedApiResponse(GetOrdersAdminResponseDto)
  async getOrders(
    @Query('date') date: Date = new Date(),
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<GetOrdersAdminResponseDto> {
    return this.orderService.getOrdersAdmin(date, page, pageSize);
  }
}
