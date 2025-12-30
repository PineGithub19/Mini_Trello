import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserResponse } from './response/user.response';
import { UserMapper } from './mappers/user.mapper';
import { UserException } from 'src/common/exceptions/user.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const user = this.userRepository.create(createUserDto);
    return UserMapper.toResponse(await this.userRepository.save(user));
  }

  async findAll() {
    return UserMapper.toResponseList(await this.userRepository.find());
  }

  async findUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new UserException('User not found');
    }
    return UserMapper.toResponse(user);
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new UserException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new UserException('User not found');
    }
    const updatedUser = await this.userRepository.update({ id }, updateUserDto);
    if (!updatedUser) {
      throw new UserException('User not found');
    }

    return this.findUserById(id);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new UserException('User not found');
    }
    await this.userRepository.remove(user);
    return UserMapper.toResponse(user);
  }
}

