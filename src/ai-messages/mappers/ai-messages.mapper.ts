import { AiMessage } from '../entities/ai-messages.entity';
import { AiMessageResponse } from '../response/ai-messages.response';

export class AiMessageMapper {
    static toResponse(aiMessage: AiMessage): AiMessageResponse {
        return {
            id: aiMessage.id,
            conversationId: aiMessage.conversationId,
            createdBy: aiMessage.createdBy,
            role: aiMessage.role,
            content: aiMessage.content,
            createdAt: aiMessage.createdAt,
            updatedAt: aiMessage.updatedAt,
        };
    }

    static toResponseList(aiMessages: AiMessage[]): AiMessageResponse[] {
        return aiMessages.map(message => this.toResponse(message));
    }
}
