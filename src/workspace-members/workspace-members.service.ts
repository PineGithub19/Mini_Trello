import { Injectable } from '@nestjs/common';
import { CreateWorkspaceMemberDto } from './dto/create-workspace-member.dto';
import { UpdateWorkspaceMemberDto } from './dto/update-workspace-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { Repository } from 'typeorm';
import { WorkspaceMemberMapper } from './mappers/workspace-member.mapper';
import { WorkspaceMemberException } from 'src/common/exceptions/workspace-member.exception';
import { UsersService } from 'src/users/users.service';
import { UserResponse } from 'src/users/response/user.response';

@Injectable()
export class WorkspaceMembersService {
  constructor(
    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: Repository<WorkspaceMember>,
    private usersService: UsersService
  ) { }

  async create(createWorkspaceMemberDto: CreateWorkspaceMemberDto, userId: string) {
    const userbyEmail = await this.usersService.findUserByEmail(createWorkspaceMemberDto.email);

    if (!userbyEmail) {
      throw new WorkspaceMemberException('User not found');
    }

    if (userbyEmail.id === userId) {
      throw new WorkspaceMemberException('You cannot add yourself to the workspace');
    }

    const workspaceMember = this.workspaceMemberRepository.create({
      ...createWorkspaceMemberDto,
      userId: userbyEmail.id
    });
    return WorkspaceMemberMapper.toResponse(await this.workspaceMemberRepository.save(workspaceMember));
  }

  async findAll(workspaceId: string) {
    let detailedWorkspaceMembers = [] as (WorkspaceMember & { userInformation: UserResponse })[];
    const workspaceMembers = await this.workspaceMemberRepository.find({ where: { workspaceId } });

    detailedWorkspaceMembers = await Promise.all(
      workspaceMembers.map(async (member) => {
        const user = await this.usersService.findUserById(member.userId);

        return {
          ...member,
          userInformation: user,
        };
      })
    );

    return WorkspaceMemberMapper.toDetailedResponseList(detailedWorkspaceMembers);
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

  async remove(id: string, workspaceId: string) {
    const workspaceMember = await this.workspaceMemberRepository.findOne({ where: { userId: id, workspaceId } });
    if (!workspaceMember) {
      throw new WorkspaceMemberException('Workspace member not found');
    }
    await this.workspaceMemberRepository.remove(workspaceMember);
    return WorkspaceMemberMapper.toResponse(workspaceMember);
  }
}
