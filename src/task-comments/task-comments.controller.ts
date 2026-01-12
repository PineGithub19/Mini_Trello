import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TaskCommentsService } from './task-comments.service';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { UpdateTaskCommentDto } from './dto/update-task-comment.dto';
import { WorkspaceMemberRole } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { ApiResponseWithData } from 'src/common/decorators/response-with-data.decorator';
import { TaskCommentResponse } from './response/task-comments.response';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WorkspaceMembersRoles } from 'src/auth/decorators/roles/workspace-members-roles.decorator';
import { WorkspaceMembersRoleGuard } from 'src/auth/guards/roles/workspace-members.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/types/jwt-payload';

@ApiTags('Task Comments')
@ApiBearerAuth()
@Controller('task-comments')
export class TaskCommentsController {
  constructor(private readonly taskCommentsService: TaskCommentsService) { }

  @Post()
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({ summary: 'Create a task comment', description: 'Creates a new comment for a specific task.' })
  @ApiResponseWithData(TaskCommentResponse, { status: 201, description: 'Created task comment' })
  create(@Body() createTaskCommentDto: CreateTaskCommentDto, @CurrentUser() user: JwtPayload) {
    return this.taskCommentsService.create(createTaskCommentDto, user.sub);
  }

  @Get('all/:id')
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({ summary: 'Find all task comments', description: 'Retrieves all task comments.' })
  @ApiResponseWithData(TaskCommentResponse, { status: 200, description: 'Found task comments' })
  findAll(@Param('id') id: string) {
    return this.taskCommentsService.findAll(id);
  }

  @Get(':id')
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({ summary: 'Find a task comment', description: 'Retrieves a single task comment by its unique identifier.' })
  @ApiResponseWithData(TaskCommentResponse, { status: 200, description: 'Found task comment' })
  findOne(@Param('id') id: string) {
    return this.taskCommentsService.findOne(id);
  }

  @Patch(':id')
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({ summary: 'Update a task comment', description: 'Updates an existing task comment.' })
  @ApiResponseWithData(TaskCommentResponse, { status: 200, description: 'Updated task comment' })
  update(@Param('id') id: string, @Body() updateTaskCommentDto: UpdateTaskCommentDto) {
    return this.taskCommentsService.update(id, updateTaskCommentDto);
  }

  @Delete(':id')
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({ summary: 'Delete a task comment', description: 'Deletes a task comment by its unique identifier.' })
  @ApiResponseWithData(TaskCommentResponse, { status: 200, description: 'Deleted task comment' })
  remove(@Param('id') id: string) {
    return this.taskCommentsService.remove(id);
  }
}
