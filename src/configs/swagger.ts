import { DocumentBuilder, SwaggerDocumentOptions } from "@nestjs/swagger";
import { Meta } from "../common/interceptors/response-formatter";

export const swaggerConfig = new DocumentBuilder()
  .setTitle('appointment-manager api')
  .setVersion('0.1')
  .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    'access-token',
  )
  .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    'refresh-token',
  )
  .build();

export const swaggerOptions: SwaggerDocumentOptions = {
  extraModels: [Meta],
};
