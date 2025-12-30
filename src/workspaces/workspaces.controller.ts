import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { WorkspaceResponse } from './response/workspace.response';
import { ApiResponseWithData } from 'src/common/decorators/response-with-data.decorator';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { WorkspaceMemberRole } from 'src/auth/enums/role.enum';
import { UserRole } from 'src/auth/enums/role.enum';
import { WorkspaceMembersRoles } from 'src/auth/decorators/roles/workspace-members-roles.decorator';
import { WorkspaceMembersRoleGuard } from 'src/auth/guards/roles/workspace-members.guard';

@ApiTags('Workspaces')
@ApiBearerAuth()
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) { }

  @Post()
  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create a new workspace', description: 'Creates a new workspace for the user.' })
  @ApiResponseWithData(WorkspaceResponse, { status: 201, description: 'The workspace has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspacesService.create(createWorkspaceDto);
  }

  @Get()
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({ summary: 'Get all workspaces', description: 'Retrieves a list of all workspaces.' })
  @ApiResponseWithData(WorkspaceResponse, { status: 200, description: 'Return all workspaces.' })
  findAll() {
    return this.workspacesService.findAll();
  }

  @Get(':id')
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({ summary: 'Get a workspace by id', description: 'Retrieves a specific workspace by its ID.' })
  @ApiResponseWithData(WorkspaceResponse, { status: 200, description: 'Return the workspace.' })
  @ApiResponse({ status: 404, description: 'Workspace not found.' })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  findOne(@Param('id') id: string) {
    return this.workspacesService.findOne(id);
  }

  @Patch(':id')
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({ summary: 'Update a workspace', description: 'Updates the details of an existing workspace.' })
  @ApiResponseWithData(WorkspaceResponse, { status: 200, description: 'The workspace has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Workspace not found.' })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  update(@Param('id') id: string, @Body() updateWorkspaceDto: UpdateWorkspaceDto) {
    return this.workspacesService.update(id, updateWorkspaceDto);
  }

  @Delete(':id')
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({ summary: 'Delete a workspace', description: 'Deletes a workspace and its associated data.' })
  @ApiResponseWithData(WorkspaceResponse, { status: 200, description: 'The workspace has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Workspace not found.' })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  remove(@Param('id') id: string) {
    return this.workspacesService.remove(id);
  }
}
