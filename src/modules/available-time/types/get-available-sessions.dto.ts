import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class AvailableSessionResponseDto {
  @Expose()
  @ApiProperty()
  date: Date;

  @Expose()
  @ApiProperty()
  price: number;

  @Expose()
  @ApiProperty()
  start: number;

  @Expose()
  @ApiProperty()
  finish: number;
}

@Exclude()
export class GetAvailableSessionsResponseDto {
  @Expose()
  @ApiProperty({ type: () => [AvailableSessionResponseDto], isArray: true })
  @Type(() => AvailableSessionResponseDto)
  sessions: AvailableSessionResponseDto[];
}
