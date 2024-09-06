import { Request, Response } from 'express';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  ResponseTypeEnum,
  Meta,
  Response as ResponseType,
  ValidationError,
} from './response-formatter.types';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { isArray } from 'class-validator';

@Injectable()
export class ResponseFormatterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    context.getClass();

    return next
      .handle()
      .pipe(
        map(this.formatResponse(req, res)),
        catchError(this.formatError(req, res)),
      );
  }

  formatResponse(req: Request, res: Response) {
    return (response: any): ResponseType => {
      const meta: Meta = {
        statusCode: res.statusCode,
        responseType: ResponseTypeEnum.SUCCESS,
        message: res.statusMessage || 'Success',
      };

      return { meta, data: response };
    };
  }

  formatError(req: Request, res: Response) {
    return async (err: any, caught: Observable<any>): Promise<ResponseType> => {
      console.log(err);
      let statusCode: number,
        message: string,
        responseType: ResponseTypeEnum,
        validationErrors: ValidationError[];

      [statusCode, message, responseType, validationErrors] =
        this.errorMetaGenerator(err);
      res.status(statusCode);
      return {
        meta: {
          statusCode,
          message,
          responseType,
          validationErrors,
          literalError: err,
        },
        data: err.cause,
      };
    };
  }

  errorMetaGenerator(
    err,
  ): [number, string, ResponseTypeEnum, ValidationError[]] {
    let statusCode: number,
      message: string,
      responseType: ResponseTypeEnum,
      validationErrors: ValidationError[];
    switch (err.constructor) {
      case BadRequestException:
        statusCode = HttpStatus.BAD_REQUEST;
        responseType = ResponseTypeEnum.VALIDATION_ERROR;
        validationErrors = this.generateValidationErrors(err.response.message);
        message = validationErrors[0]?.message
          ? validationErrors[0]?.message
          : err.message;

        break;
      case QueryFailedError:
        statusCode = this.getDBErrorStatusCode(err);
        message = (err as QueryFailedError).name;
        responseType = ResponseTypeEnum.ERROR;
        break;
      case TypeORMError:
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Internal Server Error';
        responseType = ResponseTypeEnum.ERROR;
        break;
      case HttpException:
        statusCode = err.getStatus();
        message = err.message;
        responseType = ResponseTypeEnum.ERROR;
        break;
      default:
        const defaultError = new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
        statusCode = defaultError.getStatus();
        message = defaultError.message;
        responseType = ResponseTypeEnum.ERROR;
        break;
    }
    return [statusCode, message, responseType, validationErrors];
  }

  getDBErrorStatusCode(err: QueryFailedError): number {
    // TODO: some logging can be helpful
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  generateValidationErrors(message: string[] | string): ValidationError[] {
    if (isArray(message))
      return message.reduce(
        (prev: ValidationError[], current: string): ValidationError[] => {
          const propertyName = current.split(' ')[0];
          return [...prev, { key: propertyName, message: current }];
        },
        [],
      ) as any as ValidationError[];
    else return [{ key: 'file', message }];
  }
}
