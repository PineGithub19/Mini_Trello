import { Injectable } from '@nestjs/common';
import { CreateWorkspaceMemberDto } from './dto/create-workspace-member.dto';
import { UpdateWorkspaceMemberDto } from './dto/update-workspace-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { Repository } from 'typeorm';
import { WorkspaceMemberMapper } from './mappers/workspace-member.mapper';
import { WorkspaceMemberException } from 'src/common/exceptions/workspace-member.exception';

@Injectable()
export class WorkspaceMembersService {
  constructor(
    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: Repository<WorkspaceMember>
  ) { }

  async create(createWorkspaceMemberDto: CreateWorkspaceMemberDto) {
    const workspaceMember = this.workspaceMemberRepository.create(createWorkspaceMemberDto);
    return WorkspaceMemberMapper.toResponse(await this.workspaceMemberRepository.save(workspaceMember));
  }

  async findAll() {
    const workspaceMembers = await this.workspaceMemberRepository.find();
    return WorkspaceMemberMapper.toResponseList(workspaceMembers);
  }

  async findOne(id: string) {
    const workspaceMember = await this.workspaceMemberRepository.findOne({ where: { id } });
    if (!workspaceMember) {
      throw new WorkspaceMemberException('Workspace member not found');
    }
    return WorkspaceMemberMapper.toResponse(workspaceMember);
  }

  async findMember(userId: string, workspaceId: string) {
    const workspaceMember = await this.workspaceMemberRepository.findOne({ where: { userId, workspaceId } });
    if (!workspaceMember) {
      throw new WorkspaceMemberException('Workspace member not found');
    }
    return WorkspaceMemberMapper.toResponse(workspaceMember);
  }

  async findOneByUserId(userId: string) {
    const workspaceMember = await this.workspaceMemberRepository.findOne({ where: { userId } });
    if (!workspaceMember) {
      throw new WorkspaceMemberException('Workspace member not found');
    }
    return WorkspaceMemberMapper.toResponse(workspaceMember);
  }

  async update(id: string, updateWorkspaceMemberDto: UpdateWorkspaceMemberDto) {
    const workspaceMember = await this.workspaceMemberRepository.findOne({ where: { id } });
    if (!workspaceMember) {
      throw new WorkspaceMemberException('Workspace member not found');
    }
    await this.workspaceMemberRepository.update({ id }, updateWorkspaceMemberDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const workspaceMember = await this.workspaceMemberRepository.findOne({ where: { id } });
    if (!workspaceMember) {
      throw new WorkspaceMemberException('Workspace member not found');
    }
    await this.workspaceMemberRepository.remove(workspaceMember);
    return WorkspaceMemberMapper.toResponse(workspaceMember);
  }
}
