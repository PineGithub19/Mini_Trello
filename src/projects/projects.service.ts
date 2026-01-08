import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectMapper } from './mappers/project.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectException } from 'src/common/exceptions/project.exception';
import { createPagination } from 'src/common/utils/pagination.util';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>
  ) { }

  async create(createProjectDto: CreateProjectDto, createdById: string) {
    const project = this.projectRepository.create({
      ...createProjectDto,
      createdBy: createdById,
    });

    const savedProject = ProjectMapper.toResponse(await this.projectRepository.save(project));
    return savedProject;
  }

  async findAll(workspaceId: string, paginationOptions: PaginationOptionsDto) {
    const [entities, itemCount] = await this.projectRepository.findAndCount({
      where: { workspaceId },
      skip: paginationOptions.skip,
      take: paginationOptions.limit,
      order: { createdAt: 'DESC' }
    });

    return createPagination(
      ProjectMapper.toResponseList(entities),
      itemCount,
      paginationOptions.page,
      paginationOptions.limit,
    );
  }

  async findOne(id: string) {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new ProjectException('Project not found');
    }
    return ProjectMapper.toResponse(project);
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new ProjectException('Project not found');
    }
    await this.projectRepository.update({ id }, updateProjectDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new ProjectException('Project not found');
    }
    await this.projectRepository.delete({ id });
    return ProjectMapper.toResponse(project);
  }
}
