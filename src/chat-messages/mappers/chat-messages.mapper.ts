import { ChatMessages } from "../entities/chat-messages.entity";
import { ChatMessagesResponse } from "../response/chat-messages.response";
import { UserResponse } from "src/users/response/user.response";

export class ChatMessagesMapper {
    static toResponse(chatMessages: ChatMessages): ChatMessagesResponse {
        return {
            id: chatMessages.id,
            chatId: chatMessages.chatId,
            senderId: chatMessages.senderId,
            message: chatMessages.message,
            createdAt: chatMessages.createdAt,
            updatedAt: chatMessages.updatedAt,
        };
    }

    static toResponseWithUser(chatMessages: ChatMessages, user: UserResponse): ChatMessagesResponse {
        return {
            id: chatMessages.id,
            chatId: chatMessages.chatId,
            senderId: chatMessages.senderId,
            message: chatMessages.message,
            createdAt: chatMessages.createdAt,
            updatedAt: chatMessages.updatedAt,
            userInformation: {
                name: user.name,
                email: user.email,
                avatar: user.avatar || '',
            },
        };
    }
}