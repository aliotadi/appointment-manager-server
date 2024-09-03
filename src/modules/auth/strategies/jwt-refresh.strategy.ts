import { ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { BaseStrategyFactory } from './base.strategy';
import { jwtConfig } from '../../../configs';
import { UserService } from '../../user/user.service';
import { JWT_STRATEGIES } from '../../../common/types';

@Injectable()
export class JwtRefreshStrategy extends BaseStrategyFactory(
  JWT_STRATEGIES.JWT_REFRESH,
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtConfig.refreshSignOptions.secret,
    passReqToCallback: true,
    ignoreExpiration: true,
  },
) {
  constructor(
    readonly jwtService: JwtService,
    readonly userService: UserService,
  ) {
    super(jwtService, userService);
  }

  // validate(req: Request, payload: JwtPayload) {
  //   return { payload };
  // }
}
