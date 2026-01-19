import { AiConversation } from "../entities/ai-conversations.entity";
import { AiConversationResponse } from "../response/ai-conversations.response";

export class AiConversationMapper {
    static toResponse(aiConversation: AiConversation): AiConversationResponse {
        return {
            id: aiConversation.id,
            projectId: aiConversation.projectId,
            createdBy: aiConversation.createdBy,
            createdAt: aiConversation.createdAt,
            updatedAt: aiConversation.updatedAt,
        };
    }

    static toResponseList(aiConversations: AiConversation[]): AiConversationResponse[] {
        return aiConversations.map(conversation => this.toResponse(conversation));
    }
}