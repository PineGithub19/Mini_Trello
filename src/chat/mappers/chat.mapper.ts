import { Chat } from "../entities/chat.entity";
import { ChatResponse } from "../response/chat.response";

export class ChatMapper {
    static toResponse(chat: Chat): ChatResponse {
        return {
            id: chat.id,
            projectId: chat.projectId,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
        };
    }
}