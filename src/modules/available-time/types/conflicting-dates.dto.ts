import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
class ConflictingDate {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  date: Date;
}

@Exclude()
export class ConflictingDatesResponseDto {
  @Expose()
  @ApiProperty({ type: () => ConflictingDate })
  @Type(() => ConflictingDate)
  conflictingDates?: ConflictingDate[];
}
