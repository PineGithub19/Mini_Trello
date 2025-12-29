import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { Repository } from 'typeorm';
import { WorkspaceMapper } from './mappers/workspace.mapper';
import { WorkspaceException } from 'src/common/exceptions/workspace.exception';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>
  ) { }

  async create(createWorkspaceDto: CreateWorkspaceDto) {
    const workspace = this.workspaceRepository.create(createWorkspaceDto);
    return WorkspaceMapper.toResponse(await this.workspaceRepository.save(workspace));
  }

  async findAll() {
    return WorkspaceMapper.toResponseList(await this.workspaceRepository.find());
  }

  async findOne(id: string) {
    const workspace = await this.workspaceRepository.findOne({ where: { id } });

    if (!workspace) {
      throw new WorkspaceException('Workspace not found');
    }

    return WorkspaceMapper.toResponse(workspace);
  }

  async update(id: string, updateWorkspaceDto: UpdateWorkspaceDto) {
    const workspace = await this.workspaceRepository.findOne({ where: { id } });
    if (!workspace) {
      throw new WorkspaceException('Workspace not found');
    }
    const updatedWorkspace = await this.workspaceRepository.update({ id }, updateWorkspaceDto);
    if (!updatedWorkspace) {
      throw new WorkspaceException('Workspace not found');
    }
    return this.findOne(id);
  }

  async remove(id: string) {
    const workspace = await this.workspaceRepository.findOne({ where: { id } });
    if (!workspace) {
      throw new WorkspaceException('Workspace not found');
    }
    await this.workspaceRepository.remove(workspace);
    return this.findOne(id);
  }
}
