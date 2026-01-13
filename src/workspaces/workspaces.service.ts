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
import { SearchService } from 'src/search/search.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: Repository<WorkspaceMember>,
    private readonly searchService: SearchService,
    private readonly redisService: RedisService
  ) { }

  async create(createWorkspaceDto: CreateWorkspaceDto, ownerId: string) {
    const workspace = this.workspaceRepository.create({
      ...createWorkspaceDto,
      ownerId,
    });

    const savedWorkspace = await this.workspaceRepository.save(workspace);
    await this.searchService.indexWorkspace(savedWorkspace);

    const responseWorkspace = WorkspaceMapper.toResponse(savedWorkspace);

    const ownerWorkspaceMember = this.workspaceMemberRepository.create({
      workspaceId: savedWorkspace.id,
      userId: savedWorkspace.ownerId,
      role: WorkspaceMemberRole.OWNER,
    });

    await this.workspaceMemberRepository.save(ownerWorkspaceMember);

    return responseWorkspace;
  }

  async findAll(ownerId: string, paginationOptions: PaginationOptionsDto) {
    const cacheKey = `workspaces:findAll:${ownerId}:${paginationOptions.page}:${paginationOptions.limit}`;
    const cachedData = await this.redisService.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const [entities, itemCount] = await this.workspaceRepository.findAndCount({
      where: { ownerId },
      skip: paginationOptions.skip,
      take: paginationOptions.limit,
      order: {
        createdAt: 'DESC',
      },
    });

    const result = createPagination(
      WorkspaceMapper.toResponseList(entities),
      itemCount,
      paginationOptions.page,
      paginationOptions.limit,
    );

    await this.redisService.set(cacheKey, result, 300); // Cache for 5 minutes

    return result;
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
    const updatedWorkspace = await this.workspaceRepository.save({ ...workspace, ...updateWorkspaceDto });
    await this.searchService.indexWorkspace(updatedWorkspace);

    return this.findOne(id);
  }

  async remove(id: string) {
    const workspace = await this.workspaceRepository.findOne({ where: { id } });
    if (!workspace) {
      throw new WorkspaceException('Workspace not found');
    }
    await this.workspaceRepository.remove(workspace);
    await this.searchService.remove(id);
    return this.findOne(id);
  }
}
