import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { FindTimeFragmentResponseDto } from '../../time-fragment/types';

@Exclude()
export class AvailableTimesAdminResponseDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  isActive: boolean;

  @Expose()
  @ApiProperty()
  date: Date;

  @Expose()
  @ApiProperty()
  start: string;

  @Expose()
  @ApiProperty()
  finish: string;

  @Expose()
  @ApiProperty({ type: () => FindTimeFragmentResponseDto })
  @Type(() => FindTimeFragmentResponseDto)
  timeFragment: FindTimeFragmentResponseDto;
}

@Exclude()
export class GetAvailableTimesAdminResponseDto {
  @Expose()
  @ApiProperty({ type: () => AvailableTimesAdminResponseDto, isArray: true })
  @Type(() => AvailableTimesAdminResponseDto)
  items: AvailableTimesAdminResponseDto[];
}
