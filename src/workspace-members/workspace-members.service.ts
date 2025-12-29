import { Injectable } from '@nestjs/common';
import { CreateWorkspaceMemberDto } from './dto/create-workspace-member.dto';
import { UpdateWorkspaceMemberDto } from './dto/update-workspace-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspaceMembersService {
  constructor(
    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: Repository<WorkspaceMember>
  ) { }

  async create(createWorkspaceMemberDto: CreateWorkspaceMemberDto) {
    const workspaceMember = this.workspaceMemberRepository.create(createWorkspaceMemberDto);
    return await this.workspaceMemberRepository.save(workspaceMember);
  }

  async findAll() {
    return await this.workspaceMemberRepository.find();
  }

  async findOne(id: string) {
    const workspaceMember = await this.workspaceMemberRepository.findOne({ where: { id } });
    if (!workspaceMember) {
      throw new Error('Workspace member not found');
    }
    return workspaceMember;
  }

  async update(id: string, updateWorkspaceMemberDto: UpdateWorkspaceMemberDto) {
    const workspaceMember = await this.workspaceMemberRepository.findOne({ where: { id } });
    if (!workspaceMember) {
      throw new Error('Workspace member not found');
    }
    return await this.workspaceMemberRepository.update({ id }, updateWorkspaceMemberDto);
  }

  async remove(id: string) {
    const workspaceMember = await this.workspaceMemberRepository.findOne({ where: { id } });
    if (!workspaceMember) {
      throw new Error('Workspace member not found');
    }
    return await this.workspaceMemberRepository.delete(workspaceMember);
  }
}
