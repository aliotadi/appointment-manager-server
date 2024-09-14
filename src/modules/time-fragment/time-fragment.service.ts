import { Injectable } from '@nestjs/common';
import { BaseService } from '../../common/baseClasses';
import { TimeFragmentEntity } from '../../db/models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TimeFragmentService extends BaseService<TimeFragmentEntity> {
  constructor(
    @InjectRepository(TimeFragmentEntity)
    timeFragmentRepository: Repository<TimeFragmentEntity>,
  ) {
    super(timeFragmentRepository);
  }
}
