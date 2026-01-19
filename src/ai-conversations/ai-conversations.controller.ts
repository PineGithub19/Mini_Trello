import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AiConversationsService } from './ai-conversations.service';
import { CreateAiConversationDto } from './dto/create-ai-conversation.dto';
import { UpdateAiConversationDto } from './dto/update-ai-conversation.dto';
import { WorkspaceMembersRoles } from 'src/auth/decorators/roles/workspace-members-roles.decorator';
import { WorkspaceMemberRole } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { WorkspaceMembersRoleGuard } from 'src/auth/guards/roles/workspace-members.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/types/jwt-payload';
import { ApiResponseWithData } from 'src/common/decorators/response-with-data.decorator';
import { AiConversationResponse } from './response/ai-conversations.response';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';

@ApiTags('AI Conversations')
@ApiBearerAuth()
@Controller('ai-conversations')
export class AiConversationsController {
  constructor(private readonly aiConversationsService: AiConversationsService) { }

  @Post()
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({
    summary: 'Create a new AI conversation',
    description: 'Creates a new AI conversation for a project. The conversation will be associated with the authenticated user as the creator.'
  })
  @ApiResponseWithData(AiConversationResponse, { status: 201, description: 'The AI conversation has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
  create(@Body() createAiConversationDto: CreateAiConversationDto, @CurrentUser() user: JwtPayload) {
    return this.aiConversationsService.create(createAiConversationDto, user.sub);
  }

  @Get()
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({
    summary: 'Get all AI conversations',
    description: 'Retrieves a paginated list of all AI conversations for a specific project.'
  })
  @ApiPaginatedResponse(AiConversationResponse, { status: 200, description: 'List of AI conversations retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
  findAll(@Query('projectId') projectId: string, @Query() paginationOptions: PaginationOptionsDto) {
    return this.aiConversationsService.findAll(projectId, paginationOptions);
  }

  @Get(':id')
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({
    summary: 'Get an AI conversation by ID',
    description: 'Retrieves a specific AI conversation by its unique identifier.'
  })
  @ApiResponseWithData(AiConversationResponse, { status: 200, description: 'AI conversation retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
  @ApiResponse({ status: 404, description: 'Not Found - AI conversation does not exist.' })
  @ApiParam({ name: 'id', description: 'AI Conversation ID', type: 'string', format: 'uuid' })
  findOne(@Param('id') id: string) {
    return this.aiConversationsService.findOne(id);
  }

  @Patch(':id')
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({
    summary: 'Update an AI conversation',
    description: 'Updates the details of an existing AI conversation.'
  })
  @ApiResponseWithData(AiConversationResponse, { status: 200, description: 'The AI conversation has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
  @ApiResponse({ status: 404, description: 'Not Found - AI conversation does not exist.' })
  @ApiParam({ name: 'id', description: 'AI Conversation ID', type: 'string', format: 'uuid' })
  update(@Param('id') id: string, @Body() updateAiConversationDto: UpdateAiConversationDto) {
    return this.aiConversationsService.update(id, updateAiConversationDto);
  }

  @Delete(':id')
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({
    summary: 'Delete an AI conversation',
    description: 'Deletes an AI conversation and all its associated messages permanently.'
  })
  @ApiResponseWithData(AiConversationResponse, { status: 200, description: 'The AI conversation has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
  @ApiResponse({ status: 404, description: 'Not Found - AI conversation does not exist.' })
  @ApiParam({ name: 'id', description: 'AI Conversation ID', type: 'string', format: 'uuid' })
  remove(@Param('id') id: string) {
    return this.aiConversationsService.remove(id);
  }
}
