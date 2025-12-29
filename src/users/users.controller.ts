import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponseWithData } from 'src/common/decorators/ResponseWithData.decorator';
import { UserResponse } from './response/user.response';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ApiOperation({ summary: 'Get all users', description: 'Retrieves a list of all registered users.' })
  @ApiResponseWithData(UserResponse, { status: 200, description: 'Return all users.' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id', description: 'Retrieves a specific user by their unique ID.' })
  @ApiResponseWithData(UserResponse, { status: 200, description: 'Return the user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', description: 'User ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user', description: 'Updates the details of an existing user.' })
  @ApiResponseWithData(UserResponse, { status: 200, description: 'The user has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', description: 'User ID' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user', description: 'Removes a user from the system.' })
  @ApiResponseWithData(UserResponse, { status: 200, description: 'The user has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', description: 'User ID' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
