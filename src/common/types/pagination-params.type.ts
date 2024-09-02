import { Expose } from 'class-transformer';
import { IsNumber, IsNumberString, IsOptional } from 'class-validator';

@Expose()
export class PaginationParams {
  @IsNumberString()
  @IsOptional()
  skip?: number = 0;

  @IsNumberString()
  @IsOptional()
  take?: number = 10;

  @IsOptional()
  order?: string; // TODO: define T<orderByProperty>

  @IsOptional()
  search?: string;
}
