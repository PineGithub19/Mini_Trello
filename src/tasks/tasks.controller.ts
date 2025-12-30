import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { TaskResponse } from './response/task.response';
import { ApiResponseWithData } from 'src/common/decorators/ResponseWithData.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { WorkspaceMemberRole } from 'src/auth/enums/role.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  @Roles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create a new task', description: 'Creates a new task within a project.' })
  @ApiResponseWithData(TaskResponse, { status: 201, description: 'The task has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @Roles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get all tasks', description: 'Retrieves a list of all tasks.' })
  @ApiResponseWithData(TaskResponse, { status: 200, description: 'Return all tasks.' })
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  @Roles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get a task by id', description: 'Retrieves a specific task by its ID.' })
  @ApiResponseWithData(TaskResponse, { status: 200, description: 'Return the task.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @Roles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update a task', description: 'Updates the details of an existing task.' })
  @ApiResponseWithData(TaskResponse, { status: 200, description: 'The task has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @Roles(WorkspaceMemberRole.OWNER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete a task', description: 'Deletes a task and its associated data.' })
  @ApiResponseWithData(TaskResponse, { status: 200, description: 'The task has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
