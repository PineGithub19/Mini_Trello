import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { WorkspaceMembersService } from './workspace-members.service';
import { CreateWorkspaceMemberDto } from './dto/create-workspace-member.dto';
import { UpdateWorkspaceMemberDto } from './dto/update-workspace-member.dto';

@ApiTags('Workspace Members')
@ApiBearerAuth()
@Controller('workspace-members')
export class WorkspaceMembersController {
  constructor(private readonly workspaceMembersService: WorkspaceMembersService) { }

  @Post()
  @ApiOperation({ summary: 'Add a new member to workspace', description: 'Adds a user to a workspace.' })
  @ApiResponse({ status: 201, description: 'The member has been successfully added.', type: WorkspaceMember })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createWorkspaceMemberDto: CreateWorkspaceMemberDto) {
    return this.workspaceMembersService.create(createWorkspaceMemberDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workspace members', description: 'Retrieves a list of all workspace members.' })
  @ApiResponse({ status: 200, description: 'Return all workspace members.', type: [WorkspaceMember] })
  findAll() {
    return this.workspaceMembersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a workspace member by id', description: 'Retrieves a specific workspace member by their ID.' })
  @ApiResponse({ status: 200, description: 'Return the workspace member.', type: WorkspaceMember })
  @ApiResponse({ status: 404, description: 'Member not found.' })
  @ApiParam({ name: 'id', description: 'Member ID' })
  findOne(@Param('id') id: string) {
    return this.workspaceMembersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a workspace member', description: 'Updates the details of a workspace member.' })
  @ApiResponse({ status: 200, description: 'The member has been successfully updated.', type: WorkspaceMember })
  @ApiResponse({ status: 404, description: 'Member not found.' })
  @ApiParam({ name: 'id', description: 'Member ID' })
  update(@Param('id') id: string, @Body() updateWorkspaceMemberDto: UpdateWorkspaceMemberDto) {
    return this.workspaceMembersService.update(id, updateWorkspaceMemberDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a member from workspace', description: 'Removes a member from a workspace.' })
  @ApiResponse({ status: 200, description: 'The member has been successfully removed.', type: WorkspaceMember })
  @ApiResponse({ status: 404, description: 'Member not found.' })
  @ApiParam({ name: 'id', description: 'Member ID' })
  remove(@Param('id') id: string) {
    return this.workspaceMembersService.remove(id);
  }
}
