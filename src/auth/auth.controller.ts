import { Controller } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/is-public/is-public.decorator';
import { RefreshDto } from './dto/refresh.dto';
import { LogoutDto } from './dto/logout.dto';

import { ApiResponseWithData } from 'src/common/decorators/response-with-data.decorator';
import { AuthResponse } from './response/auth.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user', description: 'Registers a new user and returns the user details.' })
  @ApiResponseWithData(User, { status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login user', description: 'Authenticates a user and returns access and refresh tokens.' })
  @ApiResponseWithData(AuthResponse, { status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token', description: 'Refreshes the access token using a valid refresh token.' })
  @ApiResponseWithData(LoginDto, { status: 200, description: 'Access token refreshed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto.refresh_token);
  }

  @Public()
  @Post('logout')
  @ApiOperation({ summary: 'Logout user', description: 'Logs out the user by invalidating the refresh token.' })
  @ApiResponseWithData(Boolean)
  logout(@Body() logoutDto: LogoutDto) {
    return this.authService.logout(logoutDto.refresh_token);
  }
}
