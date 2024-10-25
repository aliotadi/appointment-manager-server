import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsPhoneNumber, IsString } from 'class-validator';

import { GetUserResponseDto } from '../../user/types';

export class LoginRequestDto {
  @IsPhoneNumber()
  @ApiProperty({ example: '+9109616770', required: true })
  phoneNumber: string;

  @IsString()
  @ApiProperty({ example: '12341234', required: true })
  password: string;
}

@Exclude()
export class LoginResponseDto {
  @Expose()
  @ApiProperty({ nullable: false })
  accessToken: string;

  @Expose()
  @ApiProperty({ nullable: false })
  refreshToken: string;

  @Expose()
  @ApiProperty({ type: () => GetUserResponseDto })
  @Type(() => GetUserResponseDto)
  user: GetUserResponseDto;
}
