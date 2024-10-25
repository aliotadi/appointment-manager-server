import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class AvailableTimeResponseDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  date: Date;

  @Expose()
  @ApiProperty()
  price: number;

  @Expose()
  @ApiProperty()
  additionalPricePerPersonPercentage: number;

  @Expose()
  @ApiProperty()
  start: number;

  @Expose()
  @ApiProperty()
  finish: number;

  @Expose()
  @ApiProperty()
  isAvailable: boolean;
}

@Exclude()
export class GetAvailableTimesResponseDto {
  @Expose()
  @ApiProperty({ type: () => [AvailableTimeResponseDto], isArray: true })
  @Type(() => AvailableTimeResponseDto)
  items: AvailableTimeResponseDto[];
}
