import { Inject, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPO')
    private userRepository: Repository<User>,
  ) {}

  async findById(sub: string) {
    return await this.userRepository.findOne({
      where: { id: sub },
    });
  }
}
