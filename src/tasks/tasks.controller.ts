import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { TaskResponse } from './response/task.response';
import { ApiResponseWithData } from 'src/common/decorators/response-with-data.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { WorkspaceMemberRole } from 'src/auth/enums/role.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { WorkspaceMembersRoles } from 'src/auth/decorators/roles/workspace-members-roles.decorator';
import { WorkspaceMembersRoleGuard } from 'src/auth/guards/roles/workspace-members.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/types/jwt-payload';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({ summary: 'Create a new task', description: 'Creates a new task within a project.' })
  @ApiResponseWithData(TaskResponse, { status: 201, description: 'The task has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: JwtPayload) {
    return this.tasksService.create(createTaskDto, user.sub);
  }

  @Get()
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({ summary: 'Get all tasks', description: 'Retrieves a list of all tasks.' })
  @ApiResponseWithData(TaskResponse, { status: 200, description: 'Return all tasks.' })
  findAll(@Query('listId') listId: string) {
    return this.tasksService.findAll(listId);
  }

  @Get(':id')
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({ summary: 'Get a task by id', description: 'Retrieves a specific task by its ID.' })
  @ApiResponseWithData(TaskResponse, { status: 200, description: 'Return the task.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({ summary: 'Update a task', description: 'Updates the details of an existing task.' })
  @ApiResponseWithData(TaskResponse, { status: 200, description: 'The task has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({ summary: 'Delete a task', description: 'Deletes a task and its associated data.' })
  @ApiResponseWithData(TaskResponse, { status: 200, description: 'The task has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
