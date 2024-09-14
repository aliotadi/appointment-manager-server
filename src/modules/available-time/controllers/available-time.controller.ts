import { Controller, Get, HttpStatus, Query, Response } from '@nestjs/common';
import { AvailableTimeService } from '../available-time.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { FormattedApiResponse } from '../../../common/decorators';
import { GetAvailableSessionsResponseDto } from '../types';

@Controller('/available-times')
@ApiTags('/available-times')
export class AvailableTimesController {
  constructor(private readonly availableTimesService: AvailableTimeService) {}

  @Get()
  @ApiQuery({ name: 'date', type: Date, required: true })
  @FormattedApiResponse(GetAvailableSessionsResponseDto)
  async getAvailableTimes(
    @Query('date') date: Date,
  ): Promise<GetAvailableSessionsResponseDto> {
    return await this.availableTimesService.getAvailableSessions(date);
  }
}
