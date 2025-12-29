import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>
  ) { }

  async create(createWorkspaceDto: CreateWorkspaceDto) {
    return await this.workspaceRepository.save(createWorkspaceDto);
  }

  async findAll() {
    return await this.workspaceRepository.find();
  }

  async findOne(id: string) {
    return await this.workspaceRepository.findOne({ where: { id } });
  }

  async update(id: string, updateWorkspaceDto: UpdateWorkspaceDto) {
    return await this.workspaceRepository.update({ id }, updateWorkspaceDto);
  }

  async remove(id: string) {
    return await this.workspaceRepository.delete({ id });
  }
}
