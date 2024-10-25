import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/baseClasses';
import { AvailableTimeEntity } from '../../db/models';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DeepPartial, Repository } from 'typeorm';
import {
  ConflictingDatesResponseDto,
  CreateAvailableTimeRequestDto,
  GetAvailableTimesAdminResponseDto,
  GetAvailableTimesResponseDto,
  UpdateAvailableTimeRequestDto,
} from './types';
import { plainToInstance } from 'class-transformer';
import { TimeFragmentService } from '../time-fragment/time-fragment.service';

@Injectable()
export class AvailableTimeService extends BaseService<AvailableTimeEntity> {
  constructor(
    @InjectRepository(AvailableTimeEntity)
    private availableTimeRepository: Repository<AvailableTimeEntity>,
    private timeFragmentService: TimeFragmentService,
  ) {
    super(availableTimeRepository);
  }

  async getAvailableTimesAdmin(
    date: Date,
  ): Promise<GetAvailableTimesAdminResponseDto> {
    const availableTimes = await this.findMany({
      where: {
        date,
      },
      relations: { timeFragment: true },
    });

    return plainToInstance(GetAvailableTimesAdminResponseDto, {
      items: availableTimes,
    });
  }

  async getAvailableTimes(date: Date): Promise<GetAvailableTimesResponseDto> {
    const availableTimes = await this.findMany({
      where: {
        date,
      },
      relations: { timeFragment: true, order: true },
      order: { start: 'ASC' },
    });

    return plainToInstance(GetAvailableTimesResponseDto, {
      items: availableTimes.map((availableTime) => ({
        ...availableTime,
        price: availableTime.timeFragment.price,
        additionalPricePerPersonPercentage:
          availableTime.timeFragment.additionalPricePerPersonPercentage,
        isAvailable: availableTime.order ? false : true,
      })),
    });
  }

  async getConflictingDates(
    dates: Date[],
    start: number,
    finish: number,
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
    const timeFragment = await this.timeFragmentService.findOne({
      where: { id: body.timeFragmentId },
    });
    if (!timeFragment) {
      throw new HttpException(
        'Time Fragment not found',
        HttpStatus.BAD_REQUEST,
      );
    }

    const timesToInsert: DeepPartial<AvailableTimeEntity>[] = body.dates
      .map((date) => {
        return this.calculateSessions(
          body.start,
          body.finish,
          timeFragment.length,
          timeFragment.rest,
        ).map((session) => ({
          date,
          start: session.start,
          finish: session.finish,
          timeFragmentId: timeFragment.id,
        }));
      })
      .reduce((prev, curr) => {
        return [...prev, ...curr];
      }, []);

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

  // async getAvailableSessions(
  //   date: Date,
  // ): Promise<GetAvailableSessionsResponseDto> {
  //   const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  //   const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  //   const availableTimes = await this.findMany({
  //     where: { date: Between(startOfDay, endOfDay) },
  //     relations: ['timeFragment'],
  //   });

  //   const sessions: AvailableSessionResponseDto[] = availableTimes
  //     .map((availableTime): AvailableSessionResponseDto[] => {
  //       const { timeFragment, start, finish } = availableTime;

  //       // Calculate sessions based on TimeFragment settings
  //       const sessions = this.calculateSessions(
  //         start,
  //         finish,
  //         timeFragment.length,
  //         timeFragment.rest,
  //       );

  //       return sessions.map((session) => ({
  //         date: availableTime.date,
  //         start: session.start,
  //         finish: session.finish,
  //         price: timeFragment.price,
  //       }));
  //     })
  //     .reduce((prev, curr) => {
  //       return [...prev, ...curr];
  //     }, []);

  //   return { sessions };
  // }

  private calculateSessions(
    start: number,
    finish: number,
    length: number,
    rest: number,
  ): { start: number; finish: number }[] {
    const sessions: { start: number; finish: number }[] = [];
    let currentStart = start;

    while (currentStart + length <= finish) {
      sessions.push({
        start: currentStart,
        finish: currentStart + length,
      });

      currentStart += length + rest;
    }

    return sessions;
  }
}
