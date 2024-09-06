import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

@Exclude()
export class IdResponseDto {
  @Expose()
  @IsNumber()
  @ApiProperty({ nullable: false, example: 1 })
  id: number;
}
