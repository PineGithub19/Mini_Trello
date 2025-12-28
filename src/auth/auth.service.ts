import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) { }

    async register(createUserDto: CreateUserDto) {
        const user = await this.usersService.findByEmail(createUserDto.email);

        if (user) {
            throw new Error('User already exists');
        }

        return this.usersService.create(createUserDto);
    }

    async login(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            throw new Error('User not found');
        }

        const ispasswordMatch = await compare(password, user.password);

        if (!ispasswordMatch) {
            throw new Error('Invalid password');
        }

        return user;
    }
}
