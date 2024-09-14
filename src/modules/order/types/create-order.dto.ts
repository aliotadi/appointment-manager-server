import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

@Exclude()
export class CreateOrderRequestDto {
  @Expose()
  @ApiProperty()
  @IsNumber()
  availableTimeId: number;

  @Expose()
  @ApiProperty()
  @IsNumber()
  start: number;

  @Expose()
  @ApiProperty()
  @IsNumber()
  finish: number;

  @Expose()
  @ApiProperty()
  @IsNumber()
  numberOfAdditionalParticipants: number;
}