import { Chat } from "src/chat/entities/chat.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('chat-messages')
export class ChatMessages {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', name: 'chat_id' })
    chatId: string;

    @Column({ type: 'uuid', name: 'sender_id' })
    senderId: string;

    @Column({ type: 'text', name: 'message' })
    message: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Chat, (chat) => chat.chatMessages)
    chat: Chat;

    @ManyToOne(() => User, (user) => user.chatMessages)
    @JoinColumn({ name: 'sender_id' })
    user: User;
}