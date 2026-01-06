import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { WorkspaceMembersService } from './workspace-members.service';
import { CreateWorkspaceMemberDto } from './dto/create-workspace-member.dto';
import { UpdateWorkspaceMemberDto } from './dto/update-workspace-member.dto';
import { WorkspaceMemberResponse } from './response/workspace-member.response';
import { ApiResponseWithData } from 'src/common/decorators/response-with-data.decorator';
import { WorkspaceMemberRole } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { WorkspaceMembersRoles } from 'src/auth/decorators/roles/workspace-members-roles.decorator';
import { WorkspaceMembersRoleGuard } from 'src/auth/guards/roles/workspace-members.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/types/jwt-payload';

@ApiTags('Workspace Members')
@ApiBearerAuth()
@Controller('workspace-members')
export class WorkspaceMembersController {
  constructor(private readonly workspaceMembersService: WorkspaceMembersService) { }

  @Post()
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({ summary: 'Add a new member to workspace', description: 'Adds a user to a workspace.' })
  @ApiResponseWithData(WorkspaceMemberResponse, { status: 201, description: 'The member has been successfully added.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createWorkspaceMemberDto: CreateWorkspaceMemberDto, @CurrentUser() user: JwtPayload) {
    return this.workspaceMembersService.create(createWorkspaceMemberDto, user.sub);
  }

  @Get()
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({ summary: 'Get all workspace members', description: 'Retrieves a list of all workspace members.' })
  @ApiResponseWithData([WorkspaceMemberResponse], { status: 200, description: 'Return all workspace members.' })
  findAll(@Query('workspaceId') workspaceId: string) {
    return this.workspaceMembersService.findAll(workspaceId);
  }

  @Get(':id')
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({ summary: 'Get a workspace member by id', description: 'Retrieves a specific workspace member by their ID.' })
  @ApiResponseWithData(WorkspaceMemberResponse, { status: 200, description: 'Return the workspace member.' })
  @ApiResponse({ status: 404, description: 'Member not found.' })
  @ApiParam({ name: 'id', description: 'Member ID' })
  findOne(@Param('id') id: string) {
    return this.workspaceMembersService.findOne(id);
  }

  @Patch(':id')
  @WorkspaceMembersRoles(WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({ summary: 'Update a workspace member', description: 'Updates the details of a workspace member.' })
  @ApiResponseWithData(WorkspaceMemberResponse, { status: 200, description: 'The member has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Member not found.' })
  @ApiParam({ name: 'id', description: 'Member ID' })
  update(@Param('id') id: string, @Body() updateWorkspaceMemberDto: UpdateWorkspaceMemberDto) {
    return this.workspaceMembersService.update(id, updateWorkspaceMemberDto);
  }

  @Delete(':id')
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({ summary: 'Remove a member from workspace', description: 'Removes a member from a workspace.' })
  @ApiResponseWithData(WorkspaceMemberResponse, { status: 200, description: 'The member has been successfully removed.' })
  @ApiResponse({ status: 404, description: 'Member not found.' })
  @ApiParam({ name: 'id', description: 'Member ID' })
  remove(@Param('id') id: string, @Query('workspaceId') workspaceId: string) {
    return this.workspaceMembersService.remove(id, workspaceId);
  }
}
