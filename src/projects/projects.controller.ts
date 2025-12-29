import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectResponse } from './response/project.response';
import { ApiResponseWithData } from 'src/common/decorators/ResponseWithData.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new project', description: 'Creates a new project within a workspace.' })
  @ApiResponseWithData(ProjectResponse, { status: 201, description: 'The project has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects', description: 'Retrieves a list of all projects.' })
  @ApiResponseWithData(ProjectResponse, { status: 200, description: 'Return all projects.' })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by id', description: 'Retrieves a specific project by its ID.' })
  @ApiResponseWithData(ProjectResponse, { status: 200, description: 'Return the project.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project', description: 'Updates the details of an existing project.' })
  @ApiResponseWithData(ProjectResponse, { status: 200, description: 'The project has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project', description: 'Deletes a project and its associated data.' })
  @ApiResponseWithData(ProjectResponse, { status: 200, description: 'The project has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
