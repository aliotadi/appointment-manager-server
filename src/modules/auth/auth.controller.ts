import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { FormattedApiResponse } from '../../common/decorators';
import {
  GetTokensResponseDto,
  LoginRequestDto,
  LoginResponseDto,
  SendOTPRequestDto,
  SendOTPResponseDto,
  VerifyOTPRequestDto,
  VerifyOTPResponseDto,
} from './types';
import { AuthGuard } from '@nestjs/passport';
import { JWT_STRATEGIES, JwtPayload } from '../../common/types';
import { AuthService } from './auth.service';

@Controller('/auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  @FormattedApiResponse(LoginResponseDto)
  @ApiBody({ type: LoginRequestDto })
  async login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.loginWithPhoneNumberPassword(
      body.phoneNumber,
      body.password,
    );
  }

  @Post('/send-otp')
  @HttpCode(200)
  @FormattedApiResponse(SendOTPResponseDto)
  @ApiBody({ type: SendOTPRequestDto })
  async sendOTP(@Body() body: SendOTPRequestDto): Promise<SendOTPResponseDto> {
    return this.authService.sendOTP(body.phoneNumber);
  }

  @Post('/verify-otp')
  @HttpCode(200)
  @ApiBody({ type: VerifyOTPRequestDto })
  @FormattedApiResponse(VerifyOTPResponseDto)
  verifyOtp(
    @Request() req,
    @Body() body: VerifyOTPRequestDto,
  ): Promise<VerifyOTPResponseDto> {
    return this.authService.verifyOtp(body.phoneNumber, body.otp);
  }

  @UseGuards(AuthGuard(JWT_STRATEGIES.JWT_REFRESH))
  @Get('/refresh')
  @ApiBearerAuth('refresh-token')
  @FormattedApiResponse(GetTokensResponseDto)
  refreshTokens(@Request() req): GetTokensResponseDto {
    const payload: JwtPayload = {
      id: req.user.id,
      role: req.user.role,
    };
    const { access_token, refresh_token } = this.authService.getTokens(payload);
    return { access_token, refresh_token };
  }
}
