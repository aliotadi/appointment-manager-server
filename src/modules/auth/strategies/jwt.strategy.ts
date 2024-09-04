import { Injectable } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';

import { jwtConfig } from '../../../configs';
import { BaseStrategyFactory } from './base.strategy';
import { UserService } from '../../user/user.service';
import { JWT_STRATEGIES } from '../../../common/types';

@Injectable()
export class JwtStrategy extends BaseStrategyFactory(JWT_STRATEGIES.JWT, {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: true,
  secretOrKey: jwtConfig.accessSignOptions.secret,
}) {
  constructor(
    readonly userService: UserService,
    readonly jwtService: JwtService,
  ) {
    super(jwtService, userService);
  }
}
