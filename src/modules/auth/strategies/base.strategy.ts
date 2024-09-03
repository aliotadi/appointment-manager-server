import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

import { UserService } from '../../user/user.service';
import { JwtPayload } from '../../../common/types';
import {
  Response,
  ResponseTypeEnum,
} from '../../../common/interceptors/response-formatter';

export const BaseStrategyFactory = (
  strategyName: string,
  superOptions: any,
) => {
  return class BaseStrategy extends PassportStrategy(Strategy, strategyName) {
    constructor(
      readonly jwtService: JwtService,
      readonly userService: UserService,
    ) {
      super(superOptions);
    }

    async authenticate(
      req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
      options?: any,
    ): Promise<void> {
      const payload = await this.isValidToken(req?.headers?.authorization);
      if (payload) {
        const user = await this.userService.findOne({
          where: { id: payload.id },
          relations: ['agent'],
        });

        if (user) (this as any).success({ ...user, role: payload.role });
        else {
          this.unauthorizedError();
        }
      } else {
        this.unauthorizedError();
      }
    }

    unauthorizedError() {
      const response: Response = {
        meta: {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized',
          responseType: ResponseTypeEnum.ERROR,
        },
      };
      (this as any).error(new HttpException(response, 401));
    }

    async isValidToken(bearerToken: string): Promise<JwtPayload> {
      try {
        return await this.jwtService.verifyAsync(
          bearerToken.replace('Bearer ', ''),
          { secret: superOptions.secretOrKey },
        );
      } catch (error) {}
    }
  };
};
