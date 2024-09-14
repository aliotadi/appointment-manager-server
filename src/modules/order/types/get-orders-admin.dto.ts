import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AvailableTimesResponseDto } from '../../available-time/types';
import { ORDER_STATUS } from './order-status.enum';

@Exclude()
class OrderAdminResponseDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  date: Date;

  @Expose()
  @ApiProperty()
  start: number;

  @Expose()
  @ApiProperty()
  finish: string;

  @Expose()
  @ApiProperty()
  basePrice: number;

  @Expose()
  @ApiProperty()
  additionalPrice: number;

  @Expose()
  @ApiProperty()
  totalPrice: number;

  @Expose()
  @ApiProperty({ enum: ORDER_STATUS })
  status: ORDER_STATUS;

  @Expose()
  @ApiProperty({ type: () => AvailableTimesResponseDto })
  @Type(() => AvailableTimesResponseDto)
  availableTime: AvailableTimesResponseDto;
}

@Exclude()
export class GetOrdersAdminResponseDto {
  @Expose()
  @ApiProperty({ type: () => OrderAdminResponseDto, isArray: true })
  @Type(() => OrderAdminResponseDto)
  items: OrderAdminResponseDto[];

  @Expose()
  @ApiProperty({ example: 10 })
  total: number;

  @Expose()
  @ApiProperty({ example: 1 })
  page: number;

  @Expose()
  @ApiProperty({ example: 10 })
  pageSize: number;

  @Expose()
  @ApiProperty({ example: 5 })
  totalPages: number;
}
