import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsPhoneNumber } from 'class-validator';
import { IsString } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { GetUserResponseDto } from '../../user/types';

@Exclude()
export class VerifyOTPRequestDto {
  @Expose()
  @ApiProperty({ required: true, example: '+989109616770' })
  @IsPhoneNumber()
  phoneNumber: string;

  @Expose()
  @ApiProperty({ required: true, example: '123456' })
  @IsString()
  otp: string;
}

@Exclude()
export class VerifyOTPResponseDto {
  @IsString()
  @ApiProperty()
  @Expose()
  access_token: string;

  @IsString()
  @ApiProperty()
  @Expose()
  refresh_token: string;

  @IsBoolean()
  @ApiProperty({ example: true })
  @Expose()
  isNew: boolean;

  @ApiProperty({ type: () => GetUserResponseDto })
  @Type(() => GetUserResponseDto)
  @Expose()
  user: GetUserResponseDto;
}
