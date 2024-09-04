import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { JWT_STRATEGIES, USER_ROLE } from '../../../common/types';
import { RolesGuard } from '../../../common/guards';
import { FormattedApiResponse, Roles } from '../../../common/decorators';
import { GetAvailableTimesResponseDto } from '../types';
import { AvailableTimeService } from '../available-time.service';

@Controller('/admin/available-time')
@ApiTags('admin/available-time')
export class AvailableTimeAdminController {
  constructor(private readonly availableTimeService: AvailableTimeService) {}

  @Get()
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(AuthGuard(JWT_STRATEGIES.JWT), RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'date' })
  @FormattedApiResponse(GetAvailableTimesResponseDto)
  async getMe(
    @Query('date') date: Date,
  ): Promise<GetAvailableTimesResponseDto[]> {
    return this.availableTimeService.getAvailableTimes(date);
  }
}
