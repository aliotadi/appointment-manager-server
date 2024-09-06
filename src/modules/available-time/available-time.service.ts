import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/baseClasses';
import { AvailableTimeEntity } from '../../db/models';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DeepPartial, Repository } from 'typeorm';
import {
  ConflictingDatesResponseDto,
  CreateAvailableTimeRequestDto,
  GetAvailableTimesResponseDto,
  UpdateAvailableTimeRequestDto,
} from './types';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AvailableTimeService extends BaseService<AvailableTimeEntity> {
  constructor(
    @InjectRepository(AvailableTimeEntity)
    private availableTimeRepository: Repository<AvailableTimeEntity>,
  ) {
    super(availableTimeRepository);
  }

  async getAvailableTimes(date: Date): Promise<GetAvailableTimesResponseDto> {
    const availableTimes = await this.findMany({
      where: {
        date,
      },
      relations: { timeFragment: true },
    });

    return plainToInstance(GetAvailableTimesResponseDto, {
      items: availableTimes,
    });
  }

  async getConflictingDates(
    dates: Date[],
    start: string,
    finish: string,
  ): Promise<{ id: number; date: Date }[]> {
    const conflictingTimes = await this.availableTimeRepository
      .createQueryBuilder('availableTime')
      .where('availableTime.date IN (:...dates)', { dates })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'availableTime.start < :start AND availableTime.finish > :start',
            { start },
          )
            .orWhere(
              'availableTime.start < :finish AND availableTime.finish > :finish',
              { finish },
            )
            .orWhere(
              'availableTime.start >= :start AND availableTime.finish <= :finish',
              { start, finish },
            );
        }),
      )
      .getMany();

    return conflictingTimes.map((conflictingTime) => ({
      id: conflictingTime.id,
      date: conflictingTime.date,
    }));
  }

  async createAvailableTimes(body: CreateAvailableTimeRequestDto) {
    const conflictingDates = await this.getConflictingDates(
      body.dates,
      body.start,
      body.finish,
    );

    if (conflictingDates.length) {
      // should find a better strategy to pass TYPED DATA to response data when this sort of exception is happening(or use some other strategy to pass needed data)
      // right now i'm to confused for this :))
      throw new HttpException(
        'conflict in  date/times detected',
        HttpStatus.CONFLICT,
        {
          cause: {
            conflictingDates: plainToInstance(
              ConflictingDatesResponseDto,
              conflictingDates,
            ),
          },
        },
      );
    }
    const timesToInsert: DeepPartial<AvailableTimeEntity>[] = body.dates.map(
      (date) => ({
        date,
        start: body.start,
        finish: body.finish,
        timeFragmentId: body.timeFragmentId,
      }),
    );
    await this.insert(timesToInsert);
  }

  async updateAvailableTime(id: number, body: UpdateAvailableTimeRequestDto) {
    const availableTimeToUpdate = await this.findOne({ where: { id } });

    if (!availableTimeToUpdate)
      throw new HttpException('Not Found', HttpStatus.BAD_REQUEST);

    if (body.start || body.finish) {
      const conflictingDates = await this.getConflictingDates(
        [availableTimeToUpdate.date],
        body.start ? body.start : availableTimeToUpdate.start,
        body.finish ? body.finish : availableTimeToUpdate.finish,
      );

      if (
        conflictingDates.find(
          (conflictingDate) => conflictingDate.id !== availableTimeToUpdate.id,
        )
      )
        throw new HttpException(
          'conflict in  date/times detected',
          HttpStatus.CONFLICT,
          {
            cause: plainToInstance(ConflictingDatesResponseDto, {
              conflictingDates: conflictingDates.filter(
                (conflictingDate) =>
                  conflictingDate.id !== availableTimeToUpdate.id,
              ),
            }),
          },
        );

      // TODO: if any order is set for availableTimeToUpdate we have to take "some" proper action and handle the time change
    }

    if (body.isActive === false) {
      // TODO: if any order is set for availableTimeToUpdate we have to avoid setting the isActive property to false
    }

    await this.update(
      { id },
      {
        ...(body.start ? { start: body.start } : {}),
        ...(body.finish ? { finish: body.finish } : {}),
        ...(body.isActive ? { isActive: body.isActive } : {}),
        ...(body.timeFragmentId ? { timeFragmentId: body.timeFragmentId } : {}),
      },
    );
    return;
  }

  async deleteAvailableTime(id: number) {
    // TODO: should avoid deleting when there are orders in the time to delete :))
    const availableTimeToDelete = await this.findOne({ where: { id } });
    if (!availableTimeToDelete)
      throw new HttpException('Not Found', HttpStatus.BAD_REQUEST);

    await this.delete(id);
  }
}
