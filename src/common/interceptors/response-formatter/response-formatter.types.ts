import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export type Response = {
  meta: Meta;
  data?: any; // TODO: can be typed i guess :))
};

export enum ResponseTypeEnum {
  ERROR = 'ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SUCCESS = 'SUCCESS',
}

export class ValidationError {
  @ApiProperty()
  key: string;

  @ApiProperty()
  message: string;
}

export class Meta {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty({ nullable: true, type: [ValidationError] })
  @Type(() => ValidationError)
  validationErrors?: ValidationError[];

  @ApiProperty({ nullable: true })
  responseType?: ResponseTypeEnum;

  @ApiProperty({ nullable: true })
  literalError?: any;
}
