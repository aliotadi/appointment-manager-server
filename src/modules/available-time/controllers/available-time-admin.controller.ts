import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { JWT_STRATEGIES, USER_ROLE } from '../../../common/types';
import { RolesGuard } from '../../../common/guards';
import { FormattedApiResponse, Roles } from '../../../common/decorators';
import {
  ConflictingDatesResponseDto,
  CreateAvailableTimeRequestDto,
  GetAvailableTimesResponseDto,
  UpdateAvailableTimeRequestDto,
} from '../types';
import { AvailableTimeService } from '../available-time.service';

@Controller('/admin/available-times')
@ApiTags('admin/available-times')
export class AvailableTimeAdminController {
  constructor(private readonly availableTimeService: AvailableTimeService) {}

  @Get()
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(AuthGuard(JWT_STRATEGIES.JWT), RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'date' })
  @FormattedApiResponse(GetAvailableTimesResponseDto)
  async getAvailableTimes(
    @Query('date') date: Date,
  ): Promise<GetAvailableTimesResponseDto> {
    return this.availableTimeService.getAvailableTimes(date);
  }

  @Post()
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(AuthGuard(JWT_STRATEGIES.JWT), RolesGuard)
  @ApiBearerAuth('access-token')
  @FormattedApiResponse(ConflictingDatesResponseDto)
  async createAvailableTime(@Body() body: CreateAvailableTimeRequestDto) {
    return await this.availableTimeService.createAvailableTimes(body);
  }

  @Patch(':id')
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(AuthGuard(JWT_STRATEGIES.JWT), RolesGuard)
  @ApiBearerAuth('access-token')
  @FormattedApiResponse(ConflictingDatesResponseDto)
  async editAvailableTime(
    @Body() body: UpdateAvailableTimeRequestDto,
    @Param('id') id: number,
  ) {
    await this.availableTimeService.updateAvailableTime(id, body);
  }

  @Delete(':id')
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(AuthGuard(JWT_STRATEGIES.JWT), RolesGuard)
  @ApiBearerAuth('access-token')
  @FormattedApiResponse()
  async deleteAvailableTime(@Param('id') id: number) {
    await this.availableTimeService.deleteAvailableTime(id);
  }
}
