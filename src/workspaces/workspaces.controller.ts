import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Workspace } from './entities/workspace.entity';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@ApiTags('Workspaces')
@ApiBearerAuth()
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new workspace', description: 'Creates a new workspace for the user.' })
  @ApiResponse({ status: 201, description: 'The workspace has been successfully created.', type: Workspace })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspacesService.create(createWorkspaceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workspaces', description: 'Retrieves a list of all workspaces.' })
  @ApiResponse({ status: 200, description: 'Return all workspaces.', type: [Workspace] })
  findAll() {
    return this.workspacesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a workspace by id', description: 'Retrieves a specific workspace by its ID.' })
  @ApiResponse({ status: 200, description: 'Return the workspace.', type: Workspace })
  @ApiResponse({ status: 404, description: 'Workspace not found.' })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  findOne(@Param('id') id: string) {
    return this.workspacesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a workspace', description: 'Updates the details of an existing workspace.' })
  @ApiResponse({ status: 200, description: 'The workspace has been successfully updated.', type: Workspace })
  @ApiResponse({ status: 404, description: 'Workspace not found.' })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  update(@Param('id') id: string, @Body() updateWorkspaceDto: UpdateWorkspaceDto) {
    return this.workspacesService.update(id, updateWorkspaceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workspace', description: 'Deletes a workspace and its associated data.' })
  @ApiResponse({ status: 200, description: 'The workspace has been successfully deleted.', type: Workspace })
  @ApiResponse({ status: 404, description: 'Workspace not found.' })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  remove(@Param('id') id: string) {
    return this.workspacesService.remove(id);
  }
}
