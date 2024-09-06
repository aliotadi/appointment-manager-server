import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsDateString, IsNumber } from 'class-validator';
import { IsTime } from '../../../common/decorators';

@Exclude()
export class CreateAvailableTimeRequestDto {
  @Expose()
  @ApiProperty({ isArray: true })
  @IsDateString({}, { each: true })
  dates: Date[];

  @Expose()
  @ApiProperty()
  @IsTime()
  start: string;

  @Expose()
  @ApiProperty()
  @IsTime()
  finish: string;

  @Expose()
  @ApiProperty()
  @IsNumber()
  timeFragmentId: number;
}
