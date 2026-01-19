import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AiMessagesService } from './ai-messages.service';
import { CreateAiMessageDto } from './dto/create-ai-message.dto';
import { UpdateAiMessageDto } from './dto/update-ai-message.dto';
import { WorkspaceMembersRoles } from 'src/auth/decorators/roles/workspace-members-roles.decorator';
import { WorkspaceMemberRole } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { WorkspaceMembersRoleGuard } from 'src/auth/guards/roles/workspace-members.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/types/jwt-payload';
import { ApiResponseWithData } from 'src/common/decorators/response-with-data.decorator';
import { AiMessageResponse } from './response/ai-messages.response';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';

@ApiTags('AI Messages')
@ApiBearerAuth()
@Controller('ai-messages')
export class AiMessagesController {
  constructor(private readonly aiMessagesService: AiMessagesService) { }

  @Post()
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({
    summary: 'Create a new AI message',
    description: 'Creates a new message in an AI conversation. The message will be associated with the authenticated user as the creator.'
  })
  @ApiResponseWithData(AiMessageResponse, { status: 201, description: 'The AI message has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
  create(@Body() createAiMessageDto: CreateAiMessageDto, @CurrentUser() user: JwtPayload) {
    return this.aiMessagesService.create(createAiMessageDto, user.sub);
  }

  @Get()
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({
    summary: 'Get all AI messages',
    description: 'Retrieves a paginated list of all AI messages for a specific conversation, ordered chronologically.'
  })
  @ApiPaginatedResponse(AiMessageResponse, { status: 200, description: 'List of AI messages retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
  findAll(@Query('conversationId') conversationId: string, @Query() paginationOptions: PaginationOptionsDto) {
    return this.aiMessagesService.findAll(conversationId, paginationOptions);
  }

  @Get(':id')
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({
    summary: 'Get an AI message by ID',
    description: 'Retrieves a specific AI message by its unique identifier.'
  })
  @ApiResponseWithData(AiMessageResponse, { status: 200, description: 'AI message retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
  @ApiResponse({ status: 404, description: 'Not Found - AI message does not exist.' })
  @ApiParam({ name: 'id', description: 'AI Message ID', type: 'string', format: 'uuid' })
  findOne(@Param('id') id: string) {
    return this.aiMessagesService.findOne(id);
  }

  @Patch(':id')
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({
    summary: 'Update an AI message',
    description: 'Updates the content or role of an existing AI message.'
  })
  @ApiResponseWithData(AiMessageResponse, { status: 200, description: 'The AI message has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
  @ApiResponse({ status: 404, description: 'Not Found - AI message does not exist.' })
  @ApiParam({ name: 'id', description: 'AI Message ID', type: 'string', format: 'uuid' })
  update(@Param('id') id: string, @Body() updateAiMessageDto: UpdateAiMessageDto) {
    return this.aiMessagesService.update(id, updateAiMessageDto);
  }

  @Delete(':id')
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({
    summary: 'Delete an AI message',
    description: 'Permanently deletes an AI message from the conversation.'
  })
  @ApiResponseWithData(AiMessageResponse, { status: 200, description: 'The AI message has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
  @ApiResponse({ status: 404, description: 'Not Found - AI message does not exist.' })
  @ApiParam({ name: 'id', description: 'AI Message ID', type: 'string', format: 'uuid' })
  remove(@Param('id') id: string) {
    return this.aiMessagesService.remove(id);
  }
}
