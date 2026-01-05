import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Name must be at most 50 characters long' })
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'The email of the user' })
  @IsEmail()
  @MinLength(5, { message: 'Email must be at least 5 characters long' })
  email: string;

  @ApiProperty({ example: 'securePassword123', description: 'The password of the user' })
  @IsString()
  @MinLength(8)
  @MaxLength(20, { message: 'Password must be at most 20 characters long' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character',
    }
  )
  password: string;
}
