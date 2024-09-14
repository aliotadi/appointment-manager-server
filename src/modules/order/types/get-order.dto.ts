import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ORDER_STATUS } from './order-status.enum';

@Exclude()
export class GetOrderResponseDto {
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
  finish: number;

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
}

@Exclude()
export class GetOrdersResponseDto {
  @Expose()
  @ApiProperty({ type: [GetOrderResponseDto] })
  items: GetOrderResponseDto[];

  @Expose()
  @ApiProperty()
  totalItems: number;

  @Expose()
  @ApiProperty()
  totalPages: number;

  @Expose()
  @ApiProperty()
  currentPage: number;
}
