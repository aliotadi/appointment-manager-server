import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { SwaggerEnumType } from '@nestjs/swagger/dist/types/swagger-enum.type';

export const ApiPaginationQuery = (
  data: {
    name: string;
    example: any;
    required?: boolean;
    enum?: SwaggerEnumType;
  }[],
) => {
  const queries = data.map((query, i) => {
    return ApiQuery({
      name: query.name,
      example: query.example,
      required: query.required,
      enum: query.enum,
    }) as PropertyDecorator;
  });
  return applyDecorators(...queries);
};
