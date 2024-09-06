import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsTime } from '../../../common/decorators';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

@Exclude()
export class UpdateAvailableTimeRequestDto {
  @Expose()
  @ApiProperty()
  @IsTime()
  @IsOptional()
  start?: string;

  @Expose()
  @ApiProperty()
  @IsTime()
  @IsOptional()
  finish?: string;

  @Expose()
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  timeFragmentId?: number;

  @Expose()
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
