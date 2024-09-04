import { Injectable } from '@nestjs/common';
import { BaseService } from '../../common/baseClasses';
import { AvailableTimeEntity } from '../../db/models';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, MoreThan, Repository } from 'typeorm';
import { GetAvailableTimesResponseDto } from './types';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AvailableTimeService extends BaseService<AvailableTimeEntity> {
  constructor(
    @InjectRepository(AvailableTimeEntity)
    availableTimeRepository: Repository<AvailableTimeEntity>,
  ) {
    super(availableTimeRepository);
  }

  async getAvailableTimes(date: Date): Promise<GetAvailableTimesResponseDto[]> {
    console.log(date);
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const availableTimes = await this.findMany({
      where: {
        start: Between(startOfDay, endOfDay),
        finish: Between(startOfDay, endOfDay),
      },
    });

    return plainToInstance(GetAvailableTimesResponseDto, availableTimes);
  }
}
