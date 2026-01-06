import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { Repository, In, Not } from 'typeorm';
import { WorkspaceMapper } from './mappers/workspace.mapper';
import { WorkspaceException } from 'src/common/exceptions/workspace.exception';
import { WorkspaceMember } from 'src/workspace-members/entities/workspace-member.entity';
import { WorkspaceMemberRole } from 'src/auth/enums/role.enum';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { createPagination } from 'src/common/utils/pagination.util';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: Repository<WorkspaceMember>
  ) { }

  async create(createWorkspaceDto: CreateWorkspaceDto) {
    const workspace = this.workspaceRepository.create(createWorkspaceDto);

    const savedWorkspace = WorkspaceMapper.toResponse(await this.workspaceRepository.save(workspace));

    const ownerWorkspaceMember = this.workspaceMemberRepository.create({
      workspaceId: savedWorkspace.id,
      userId: savedWorkspace.ownerId,
      role: WorkspaceMemberRole.OWNER,
    });

    await this.workspaceMemberRepository.save(ownerWorkspaceMember);

    return savedWorkspace;
  }

  async findAll(ownerId: string, paginationOptions: PaginationOptionsDto) {
    const [entities, itemCount] = await this.workspaceRepository.findAndCount({
      where: { ownerId },
      skip: paginationOptions.skip,
      take: paginationOptions.limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return createPagination(
      WorkspaceMapper.toResponseList(entities),
      itemCount,
      paginationOptions.page,
      paginationOptions.limit,
    );
  }

  async findAllColaboratedWorkspaces(memberId: string, paginationOptions: PaginationOptionsDto) {
    const workspaceIds = await this.workspaceMemberRepository.find({ select: ['workspaceId'], where: { userId: memberId } });

    const [entities, itemCount] = await this.workspaceRepository.findAndCount({
      where: { id: In(workspaceIds.map((id) => id.workspaceId)), ownerId: Not(memberId) },
      skip: paginationOptions.skip,
      take: paginationOptions.limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return createPagination(
      WorkspaceMapper.toResponseList(entities),
      itemCount,
      paginationOptions.page,
      paginationOptions.limit,
    );
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
