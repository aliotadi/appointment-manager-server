import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class GetUserResponseDto {
  @Expose()
  @ApiProperty({ nullable: false })
  id: number;

  @Expose()
  @ApiProperty({ nullable: false })
  isActive: boolean;

  @Expose()
  @ApiProperty({ nullable: false })
  createdAt: Date;

  @Expose()
  @ApiProperty({ nullable: true, example: 'ali' })
  firstName: string;

  
  @Expose()
  @ApiProperty({ nullable: true, example: 'otadi' })
  lastName: string;

  @Expose()
  @ApiProperty({ nullable: false, example: '+989109616770' })
  phoneNumber: string;
}
