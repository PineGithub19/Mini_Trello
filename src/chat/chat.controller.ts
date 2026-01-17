import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatResponse } from './response/chat.response';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WorkspaceMembersRoles } from 'src/auth/decorators/roles/workspace-members-roles.decorator';
import { WorkspaceMemberRole } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { WorkspaceMembersRoleGuard } from 'src/auth/guards/roles/workspace-members.guard';
import { ApiResponseWithData } from 'src/common/decorators/response-with-data.decorator';

@Controller('chat')
@ApiTags('Chat')
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {
  }

  @Post()
  @WorkspaceMembersRoles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.MEMBER)
  @UseGuards(RolesGuard, WorkspaceMembersRoleGuard)
  @ApiOperation({ summary: 'Create a new chat', description: 'Creates a new chat within a project.' })
  @ApiResponseWithData(ChatResponse, { status: 201, description: 'The chat has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  async createChat(@Body() chatDto: CreateChatDto): Promise<ChatResponse> {
    return this.chatService.createChat(chatDto);
  }
}
