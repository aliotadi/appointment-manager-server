import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

@Exclude()
export class CreateTimeFragmentRequestDto {
  @Expose()
  @ApiProperty({ description: 'in minutes' })
  @IsNumber()
  length: number;

  @Expose()
  @ApiProperty()
  @IsNumber()
  rest: number;

  @Expose()
  @ApiProperty()
  @IsString()
  name: string;

  @Expose()
  @ApiProperty()
  @IsNumber()
  price: number;

  @Expose()
  @ApiProperty({
    description:
      'additional charge per each plus person is registered to meeting',
  })
  @IsNumber()
  additionalPricePerPersonPercentage: number;
}

@Exclude()
export class UpdateTimeFragmentRequestDto extends PartialType(
  CreateTimeFragmentRequestDto,
) {
  @Expose()
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}

@Exclude()
export class FindTimeFragmentResponseDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  length: number;

  @Expose()
  @ApiProperty()
  rest: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  price: number;

  @Expose()
  @ApiProperty()
  additionalPricePerPersonPercentage: number;

  @Expose()
  @ApiProperty()
  isActive: boolean;
}
