import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { plainToInstance } from 'class-transformer';
import Redis from 'ioredis';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';

import { ENVIRONMENTS, JwtPayload, USER_ROLE } from '../../common/types';
import { UserService } from '../user/user.service';
import {
  GetTokensResponseDto,
  LoginResponseDto,
  SendOTPResponseDto,
  VerifyOTPResponseDto,
} from './types';
import { UserEntity } from '../../db/models';
import { jwtConfig } from '../../configs';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class AuthService {
  private isProductionEnv: boolean =
    process.env.NODE_ENV === ENVIRONMENTS.PRODUCTION;

  private redisClient: Redis;

  private expireSteps = this.isProductionEnv
    ? [30, 60, 120, 180]
    : [5, 10, 15, 20];

  private testPhones = ['09109616770'];

  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private redisService: RedisService,
    private jwtService: JwtService,
    private smsService: SmsService,
  ) {
    this.redisClient = this.redisService.getClient();
  }

  async loginWithPhoneNumberPassword(
    phoneNumber: string,
    password: string,
  ): Promise<LoginResponseDto> {
    try {
      const user = await this.userService.findOne({ where: { phoneNumber } });
      if (bcrypt.compareSync(password, user?.password)) {
        const { accessToken, refreshToken } = this.getTokens(user);

        return plainToInstance(LoginResponseDto, {
          accessToken,
          refreshToken,
          user,
        });
      }
      throw new HttpException('Unauthorized', 401);
    } catch (e) {
      throw new HttpException('Unauthorized', 401);
    }
  }

  private async setRedisKey(key: string, otp: string): Promise<boolean> {
    const retryKey = `RETRY:${key}`;
    const retries = await this.redisClient.get(retryKey);
    let expireStep = 0;
    if (retries) {
      if (+retries >= this.expireSteps.length) {
        expireStep = this.expireSteps.length - 1;
      } else {
        expireStep = +retries + 1;
      }
    }
    await this.redisClient.set(key, otp);
    await this.redisClient.expire(key, this.expireSteps[expireStep] * 3);
    await this.redisClient.set(retryKey, expireStep);
    await this.redisClient.expire(
      retryKey,
      this.expireSteps[this.expireSteps.length - 1] * 10,
    );
    return true;
  }

  async sendOTP(phoneNumber: string): Promise<SendOTPResponseDto> {
    const otpRedisKey = `OTP:CLIENT:${phoneNumber}`;
    const ttl = await this.redisClient.ttl(otpRedisKey);
    if (ttl > 0) {
      throw new HttpException(
        `can't resend code until ${ttl} seconds`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const otp = `${Math.floor(Math.random() * 90000) + 10000}`;
    if (
      this.isProductionEnv ||
      this.testPhones.find((testPhone) => phoneNumber === testPhone)
    ) {
      await this.smsService.sendOtp(phoneNumber, otp);
    }
    await this.setRedisKey(otpRedisKey, otp);
    return {
      message: 'Otp sent successfully',
    };
  }

  async isValidOtp(phoneNumber: string, otp: string): Promise<boolean> {
    const otpRedisKey = `OTP:CLIENT:${phoneNumber}`;
    let isValid = false;
    if (
      this.isProductionEnv ||
      this.testPhones.find((testPhone) => phoneNumber === testPhone)
    ) {
      const validOtp = await this.redisClient.get(otpRedisKey);
      isValid = validOtp == otp;
    } else {
      isValid = speakeasy.totp.verify({
        secret: process.env.GAUTH_SECRET,
        encoding: 'base32',
        token: otp,
      });
    }

    if (isValid) {
      await this.redisClient.del(otpRedisKey);
      await this.redisClient.del(`RETRY:${otpRedisKey}`);
    }
    return isValid;
  }

  async verifyOtp(
    phoneNumber: string,
    otp: string,
  ): Promise<VerifyOTPResponseDto> {
    const isValid = await this.isValidOtp(phoneNumber, otp);
    if (isValid) {
      let isNew = false;
      const userId = await this.userService.insertOrIgnore({
        phoneNumber,
        phoneNumberVerified: true,
      });

      if (userId) {
        isNew = true;
      }

      const user = await this.userService.findOne({
        where: { phoneNumber: phoneNumber },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          isAdmin: true,
          isActive: true,
          createdAt: true,
          phoneNumberVerified: true,
          phoneNumber: true,
        },
      });

      const loginInfo = this.getTokens(user);

      return plainToInstance(VerifyOTPResponseDto, {
        ...loginInfo,
        user,
        isNew,
      });
    } else {
      throw new HttpException('wrong code', 403);
    }
  }

  getTokens(user: UserEntity | JwtPayload): GetTokensResponseDto {
    const role: USER_ROLE = (user as UserEntity).isAdmin
      ? USER_ROLE.ADMIN
      : USER_ROLE.CLIENT;
    const payload: JwtPayload = {
      id: user.id,
      role: (user as JwtPayload).role ? (user as JwtPayload).role : role,
    };
    const [accessToken, refreshToken] = [
      this.jwtService.sign(payload, jwtConfig.accessSignOptions),
      this.jwtService.sign(payload, jwtConfig.refreshSignOptions),
    ];
    return {
      accessToken,
      refreshToken,
    };
  }
}
