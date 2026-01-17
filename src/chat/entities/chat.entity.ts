import { ChatMessages } from "src/chat-messages/entities/chat-messages.entity";
import { Project } from "src/projects/entities/project.entity";
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('chat')
export class Chat {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', name: 'project_id' })
    projectId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => Project, (project) => project.chat)
    project: Project;

    @OneToMany(() => ChatMessages, (chatMessages) => chatMessages.chat)
    chatMessages: ChatMessages[];
}