import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

import { UserService } from "../user.service";
import { JWT_STRATEGIES } from "../../../common/types";
import { FormattedApiResponse } from "../../../common/decorators";
import { UserResponseDto } from "../types";

@Controller('/user')
@ApiTags('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/me')
    // @UseGuards(AuthGuard(JWT_STRATEGIES.JWT))
    // @ApiBearerAuth('access-token')
    // @FormattedApiResponse(UserResponseDto)
    async getMe(@Req() req): Promise<UserResponseDto> {
        return this.userService.getUser(1);
    }
    
}
