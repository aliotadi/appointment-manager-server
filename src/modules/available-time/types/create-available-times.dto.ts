import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsDateString, IsNumber } from 'class-validator';
import { IsTime } from '../../../common/decorators';

@Exclude()
export class CreateAvailableTimeRequestDto {
  @Expose()
  @ApiProperty({ isArray: true, type: [Date], example: ['2024-9-7'] })
  @IsDateString({}, { each: true })
  dates: Date[];

  @Expose()
  @ApiProperty()
  @IsTime()
  start: number;

  @Expose()
  @ApiProperty()
  @IsTime()
  finish: number;

  @Expose()
  @ApiProperty()
  @IsNumber()
  timeFragmentId: number;
}
