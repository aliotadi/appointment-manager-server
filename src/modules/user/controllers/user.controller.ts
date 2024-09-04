import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from '../user.service';
import { JWT_STRATEGIES, JwtPayload } from '../../../common/types';
import { FormattedApiResponse, Payload } from '../../../common/decorators';
import { GetUserResponseDto } from '../types';
import { UserEntity } from '../../../db/models';

@Controller('/user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @UseGuards(AuthGuard(JWT_STRATEGIES.JWT))
  @ApiBearerAuth('access-token')
  @FormattedApiResponse(GetUserResponseDto)
  async getMe(@Payload() user: JwtPayload): Promise<GetUserResponseDto> {
    return this.userService.getUser(user.id);
  }
}
