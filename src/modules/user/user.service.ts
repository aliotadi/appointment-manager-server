import { Injectable } from '@nestjs/common';
import { BaseService } from '../../common/baseClasses';
import { UserEntity } from '../../db/models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetUserResponseDto } from './types';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  async getUser(userId: number): Promise<GetUserResponseDto> {
    const user = await this.findOne({ where: { id: userId } });
    return plainToInstance(GetUserResponseDto, user);
  }
}
