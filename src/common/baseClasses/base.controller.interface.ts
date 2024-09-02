import { BaseEntity } from '../../db/models/base.entity';
import { PaginationParams } from '../types';


export interface IBaseController<
  EntityType extends BaseEntity,
  CreateRequestDto,
  UpdateRequestDto,
  FindResponseDto,
  IdResponseDto,
> {
  create(entity: CreateRequestDto): Promise<IdResponseDto>;

  findById(id: number): Promise<FindResponseDto>;

  delete(id: number): Promise<void>;

  update(id: number, entity: UpdateRequestDto): Promise<FindResponseDto>;

  findAll(
    query: PaginationParams,
  ): Promise<{ items: FindResponseDto[]; count: number }>;
}
