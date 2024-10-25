import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

export class SendOTPRequestDto {
  @IsPhoneNumber('IR')
  @ApiProperty({
    example: '09109616770',
  })
  phoneNumber: string;
}

export class SendOTPResponseDto {
  @ApiProperty({ example: 'Otp sent successfully' })
  message: string;
}
