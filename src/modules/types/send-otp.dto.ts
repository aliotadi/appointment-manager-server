import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';
import { IsBoolean, IsString } from 'class-validator';

export class SendOTPRequestDto {
  @IsPhoneNumber()
  @ApiProperty({
    example: '+989109616770',
  })
  phoneNumber: string;
}

export class SendOTPResponseDto {
  @ApiProperty({ example: 'Otp sent successfully' })
  message: string;
}
