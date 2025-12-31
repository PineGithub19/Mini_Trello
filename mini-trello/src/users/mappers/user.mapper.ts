import { User } from '../entities/user.entity';
import { UserResponse } from '../response/user.response';

export class UserMapper {
    static toResponse(user: User): UserResponse {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    static toResponseList(users: User[]): UserResponse[] {
        return users.map(UserMapper.toResponse);
    }
}
