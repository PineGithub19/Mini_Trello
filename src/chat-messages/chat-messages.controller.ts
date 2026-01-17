import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ChatMessagesService } from './chat-messages.service';
import { CreateChatMessagesDto } from './dto/create-chat-messages.dto';
import { UpdateChatMessagesDto } from './dto/update-chat-messages.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WorkspaceMembersRoles } from 'src/auth/decorators/roles/workspace-members-roles.decorator';
import { WorkspaceMemberRole } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { WorkspaceMembersRoleGuard } from 'src/auth/guards/roles/workspace-members.guard';
import { ApiResponseWithData } from 'src/common/decorators/response-with-data.decorator';
import { ChatMessagesResponse } from './response/chat-messages.response';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/types/jwt-payload';

@Controller('chat-messages')
@ApiTags('ChatMessages')
@ApiBearerAuth()
export class ChatMessagesController {
  constructor(private readonly chatMessagesService: ChatMessagesService) { }

  @Post()
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({ summary: 'Create a new chat message', description: 'Creates a new message in a chat.' })
  @ApiResponseWithData(ChatMessagesResponse, { status: 201, description: 'The chat message has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Chat or Sender not found.' })
  create(@Body() createChatMessagesDto: CreateChatMessagesDto, @CurrentUser() user: JwtPayload) {
    return this.chatMessagesService.create(createChatMessagesDto, user.sub);
  }

  @Get()
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({ summary: 'Get all chat messages', description: 'Retrieves all chat messages.' })
  @ApiResponseWithData([ChatMessagesResponse], { status: 200, description: 'List of chat messages.' })
  findAll(@Query('chatId') chatId: string) {
    return this.chatMessagesService.findAll(chatId);
  }

  @Get(':id')
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({ summary: 'Get a chat message by ID', description: 'Retrieves a single chat message by its ID.' })
  @ApiResponseWithData(ChatMessagesResponse, { status: 200, description: 'The chat message.' })
  @ApiResponse({ status: 404, description: 'Chat message not found.' })
  findOne(@Param('id') id: string) {
    return this.chatMessagesService.findOne(id);
  }

  @Patch(':id')
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({ summary: 'Update a chat message', description: 'Updates an existing chat message.' })
  @ApiResponseWithData(ChatMessagesResponse, { status: 200, description: 'The chat message has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Chat message not found.' })
  update(@Param('id') id: string, @Body() updateChatMessagesDto: UpdateChatMessagesDto) {
    return this.chatMessagesService.update(id, updateChatMessagesDto);
  }

  @Delete(':id')
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({ summary: 'Delete a chat message', description: 'Deletes a chat message by its ID.' })
  @ApiResponse({ status: 200, description: 'The chat message has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Chat message not found.' })
  remove(@Param('id') id: string) {
    return this.chatMessagesService.remove(id);
  }
}
