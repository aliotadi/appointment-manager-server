import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsTime } from '../../../common/decorators';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

@Exclude()
export class UpdateAvailableTimeRequestDto {
  @Expose()
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  start?: number;

  @Expose()
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  finish?: number;

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
