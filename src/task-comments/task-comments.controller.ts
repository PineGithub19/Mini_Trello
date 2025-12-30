import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TaskCommentsService } from './task-comments.service';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { UpdateTaskCommentDto } from './dto/update-task-comment.dto';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { WorkspaceMemberRole } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { ApiResponseWithData } from 'src/common/decorators/ResponseWithData.decorator';
import { TaskCommentResponse } from './response/task-comments.response';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('task-comments')
@ApiTags('Task Comments')
@ApiBearerAuth()
export class TaskCommentsController {
  constructor(private readonly taskCommentsService: TaskCommentsService) { }

  @Post()
  @Roles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create a task comment', description: 'Creates a new comment for a specific task.' })
  @ApiResponseWithData(TaskCommentResponse, { status: 201, description: 'Created task comment' })
  create(@Body() createTaskCommentDto: CreateTaskCommentDto) {
    return this.taskCommentsService.create(createTaskCommentDto);
  }

  @Get()
  @Roles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Find all task comments', description: 'Retrieves all task comments.' })
  @ApiResponseWithData(TaskCommentResponse, { status: 200, description: 'Found task comments' })
  findAll() {
    return this.taskCommentsService.findAll();
  }

  @Get(':id')
  @Roles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Find a task comment', description: 'Retrieves a single task comment by its unique identifier.' })
  @ApiResponseWithData(TaskCommentResponse, { status: 200, description: 'Found task comment' })
  findOne(@Param('id') id: string) {
    return this.taskCommentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update a task comment', description: 'Updates an existing task comment.' })
  @ApiResponseWithData(TaskCommentResponse, { status: 200, description: 'Updated task comment' })
  update(@Param('id') id: string, @Body() updateTaskCommentDto: UpdateTaskCommentDto) {
    return this.taskCommentsService.update(id, updateTaskCommentDto);
  }

  @Delete(':id')
  @Roles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete a task comment', description: 'Deletes a task comment by its unique identifier.' })
  @ApiResponseWithData(TaskCommentResponse, { status: 200, description: 'Deleted task comment' })
  remove(@Param('id') id: string) {
    return this.taskCommentsService.remove(id);
  }
}
