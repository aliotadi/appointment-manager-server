import { Injectable } from '@nestjs/common';
import { BaseService } from '../../common/baseClasses';
import { UserEntity } from '../../db/models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserResponseDto } from './types';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  async getUser(userId: number): Promise<UserResponseDto> {
    const hellow = await this.findOne({ where: { id: userId } });
    console.log(hellow);
    return {
      id: 1,
      firstName: 'ali',
      lastName: 'otadi',
      createdAt: new Date(),
      isActive: true,
      phoneNumber: '09109616770',
    };
  }
}
