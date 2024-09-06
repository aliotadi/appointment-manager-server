import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsString } from "class-validator";

@Exclude()
export class GetTokensResponseDto {
    @IsString()
    @Expose()
    @ApiProperty()
    access_token: string;
  
    @IsString()
    @Expose()
    @ApiProperty()
    refresh_token: string;
  }
  