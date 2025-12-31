import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './types/jwt-payload';
import { AuthException } from 'src/common/exceptions/auth.exception';
import { UserRole } from "src/auth/enums/role.enum";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {
        if (!this.configService.get<string>('JWT_SECRET')) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        if (!this.configService.get<string>('JWT_REFRESH_SECRET')) {
            throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
        }
    }

    async register(createUserDto: CreateUserDto) {
        const user = await this.usersService.findByEmail(createUserDto.email);

        if (user) {
            throw new AuthException('User already exists', 409);
        }

        return this.usersService.create(createUserDto);
    }

    async login(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            throw new AuthException('User not found', 404);
        }

        const ispasswordMatch = await compare(password, user.password);

        if (!ispasswordMatch) {
            throw new AuthException('Invalid password', 401);
        }

        const tokens = await this.getTokens(user.id);
        await this.updateRefreshToken(user.id, tokens.refresh_token);

        return tokens;
    }

    async refresh(refresh_token: string) {
        try {
            const payload = await this.jwtService.verifyAsync(refresh_token, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            }) as JwtPayload;

            const user = await this.usersService.findOne(payload.sub);
            if (!user || !user.hashedRefreshToken) {
                throw new AuthException('Access Denied', 401);
            }

            const refreshTokenMatches = await compare(refresh_token, user.hashedRefreshToken);
            if (!refreshTokenMatches) {
                throw new AuthException('Access Denied', 401);
            }

            const tokens = await this.getTokens(user.id);
            await this.updateRefreshToken(user.id, tokens.refresh_token);

            return tokens;
        } catch {
            throw new AuthException('Access Denied', 401);
        }
    }

    async logout(refresh_token: string) {
        const payload = await this.jwtService.verifyAsync(refresh_token, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        }) as JwtPayload;

        const user = await this.usersService.findOne(payload.sub);
        if (!user || !user.hashedRefreshToken) {
            throw new AuthException('Access Denied', 401);
        }

        const refreshTokenMatches = await compare(refresh_token, user.hashedRefreshToken);
        if (!refreshTokenMatches) {
            throw new AuthException('Access Denied', 401);
        }

        await this.usersService.update(user.id, { hashedRefreshToken: null });

        return true;
    }

    async updateRefreshToken(userId: string, refreshToken: string) {
        const hashedRefreshToken = await hash(refreshToken, 10);
        await this.usersService.update(userId, { hashedRefreshToken });
    }

    async getTokens(userId: string) {
        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    role: [UserRole.USER]
                } as JwtPayload,
                {
                    secret: this.configService.get<string>('JWT_SECRET'),
                    expiresIn: (this.configService.get<string>('JWT_EXPIRES_IN') ?? '60s') as any,
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    role: [UserRole.USER]
                } as JwtPayload,
                {
                    secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                    expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '1d') as any,
                },
            ),
        ]);

        return {
            access_token,
            refresh_token,
        };
    }
}
