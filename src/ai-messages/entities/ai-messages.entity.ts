
import { AiConversation } from "src/ai-conversations/entities/ai-conversations.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum AiMessageRole {
    USER = 'user',
    ASSISTANT = 'assistant',
    SYSTEM = 'system'
}

@Entity('ai-messages')
export class AiMessage {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ type: 'uuid', name: 'conversation_id' })
    conversationId: string;

    @Column({ type: 'uuid', name: 'created_by' })
    createdBy: string;

    @Column({ type: 'enum', enum: AiMessageRole })
    role: AiMessageRole;

    @Column({ type: 'text' })
    content: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => AiConversation, (conversation) => conversation.aiMessages)
    conversation: AiConversation;
}