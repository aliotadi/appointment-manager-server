import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { Meta } from '../interceptors/response-formatter';

export const FormattedApiResponse = (
  model?: Function,
  addToExtraModel: boolean = true,
) => {
  const decorators = [];
  decorators.push(
    ApiOkResponse({
      schema: {
        properties: {
          meta: { $ref: getSchemaPath(Meta) },
          // data: { $ref: getSchemaPath(model) },
          ...(model ? { data: { $ref: getSchemaPath(model) } } : {}),
        },
      },
    }),
  );
  if (addToExtraModel && model) {
    decorators.push(ApiExtraModels(model));
  }
  return applyDecorators(...decorators);
};
