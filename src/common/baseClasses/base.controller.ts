import {
  Body,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Type,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { BaseEntity } from '../../db/models/base.entity';
import { JWT_STRATEGIES, PaginationParams } from '../types';
import { IBaseController } from './base.controller.interface';
import { AbstractValidationPipe } from '../pipes';
import { BaseService } from './base.service';
import { ApiPaginationQuery, FormattedApiResponse, Roles } from '../decorators';
import { USER_ROLE } from '../types';
import { RolesGuard } from '../guards';

export function ControllerFactory<
  T extends BaseEntity,
  CreateRequestDto,
  UpdateRequestDto,
  FindResponseDto,
  IdResponseDto,
>(
  entity: Type<T>,
  createRequestDto: Type<CreateRequestDto>,
  updateRequestDto: Type<UpdateRequestDto>,
  findResponseDto: Type<FindResponseDto>,
  idResponseDto: Type<IdResponseDto>,
): Type<
  IBaseController<
    T,
    CreateRequestDto,
    UpdateRequestDto,
    FindResponseDto,
    IdResponseDto
  >
> {
  const createPipe = new AbstractValidationPipe(
    { whitelist: true, transform: true },
    { body: createRequestDto },
  );
  const updatePipe = new AbstractValidationPipe(
    { whitelist: true, transform: true },
    { body: updateRequestDto },
  );
  class BaseController
    implements
      IBaseController<
        T,
        CreateRequestDto,
        UpdateRequestDto,
        FindResponseDto,
        IdResponseDto
      >
  {
    constructor(private readonly baseService: BaseService<T>) {}

    @Post()
    @Roles(USER_ROLE.ADMIN)
    @UseGuards(AuthGuard(JWT_STRATEGIES.JWT), RolesGuard)
    @ApiBody({ type: createRequestDto })
    @ApiBearerAuth('access-token')
    @FormattedApiResponse(idResponseDto, true)
    @UsePipes(createPipe)
    async create(@Body() entity: CreateRequestDto): Promise<IdResponseDto> {
      const response = await this.baseService.insert(entity as unknown as T);
      return plainToInstance(idResponseDto, response.identifiers[0]);
    }

    @Get('/:id')
    @Roles(USER_ROLE.ADMIN)
    @UseGuards(AuthGuard(JWT_STRATEGIES.JWT), RolesGuard)
    @ApiParam({ name: 'id', example: 1 })
    @ApiBearerAuth('access-token')
    @FormattedApiResponse(findResponseDto, true)
    async findById(@Param('id') id: number): Promise<FindResponseDto> {
      const response = await this.baseService.findOne({
        where: { id: id as any },
      });
      if (!response) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      return plainToInstance(findResponseDto, response);
    }

    @Delete('/:id')
    @Roles(USER_ROLE.ADMIN)
    @UseGuards(AuthGuard(JWT_STRATEGIES.JWT), RolesGuard)
    @ApiParam({ name: 'id', example: 1 })
    @ApiBearerAuth('access-token')
    @FormattedApiResponse()
    async delete(@Param('id') id: number) {
      await this.baseService.delete(id);
    }

    @Patch('/:id')
    @Roles(USER_ROLE.ADMIN)
    @UseGuards(AuthGuard(JWT_STRATEGIES.JWT), RolesGuard)
    @ApiParam({ name: 'id', example: 1 })
    @ApiBody({ type: updateRequestDto })
    @ApiBearerAuth('access-token')
    @FormattedApiResponse(findResponseDto)
    @UsePipes(updatePipe)
    async update(
      @Param('id') id: number,
      @Body() entity: UpdateRequestDto,
    ): Promise<FindResponseDto> {
      const response = await this.baseService.update(
        { id: id as any },
        entity as unknown as T,
      );
      return plainToInstance(findResponseDto, response);
    }

    @Roles(USER_ROLE.ADMIN)
    @UseGuards(AuthGuard(JWT_STRATEGIES.JWT), RolesGuard)
    @ApiBearerAuth('access-token')
    @ApiPaginationQuery([
      { name: 'skip', example: 0, required: true },
      { name: 'take', example: 10, required: true },
      { name: 'order', example: { id: -1 }, required: false },
      { name: 'search', example: 'key word', required: false },
    ])
    @Get()
    async findAll(
      @Query() query: PaginationParams,
    ): Promise<{ items: FindResponseDto[]; count: number }> {
      const result = await this.baseService.paginate({
        skip: query.skip,
        take: query.take,
        order: query.order ? JSON.parse(query.order) : undefined,
      });
      return {
        items: plainToInstance(findResponseDto, result[0]),
        count: result[1],
      };
    }
  }
  return BaseController;
}
