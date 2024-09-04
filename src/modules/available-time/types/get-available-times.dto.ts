import { Exclude, Expose } from 'class-transformer';
import { TIME_FRAGMENT } from './time-fragment.enum';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class GetAvailableTimesResponseDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  isActive: boolean;

  @Expose()
  @ApiProperty()
  start: Date;

  @Expose()
  @ApiProperty()
  finish: Date;

  @Expose()
  @ApiProperty({ enum: TIME_FRAGMENT })
  allowedFragment: TIME_FRAGMENT;

  @Expose()
  @ApiProperty()
  restTime: number;
}
