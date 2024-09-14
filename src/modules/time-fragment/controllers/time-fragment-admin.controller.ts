import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TimeFragmentService } from '../time-fragment.service';
import { ControllerFactory } from '../../../common/baseClasses';
import { TimeFragmentEntity } from '../../../db/models';
import {
  CreateTimeFragmentRequestDto,
  FindTimeFragmentResponseDto,
  UpdateTimeFragmentRequestDto,
} from '../types';
import { IdResponseDto } from '../../../common/types';

@Controller('/admin/time-fragments')
@ApiTags('/admin/time-fragments')
export class TimeFragmentAdminController extends ControllerFactory<
  TimeFragmentEntity,
  CreateTimeFragmentRequestDto,
  UpdateTimeFragmentRequestDto,
  FindTimeFragmentResponseDto,
  IdResponseDto
>(
  TimeFragmentEntity,
  CreateTimeFragmentRequestDto,
  UpdateTimeFragmentRequestDto,
  FindTimeFragmentResponseDto,
  IdResponseDto,
) {
  constructor(private readonly timeFragmentService: TimeFragmentService) {
    super(timeFragmentService);
  }
}
