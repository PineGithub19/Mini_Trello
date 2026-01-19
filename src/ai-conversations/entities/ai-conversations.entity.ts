import { AiMessage } from "src/ai-messages/entities/ai-messages.entity";
import { Project } from "src/projects/entities/project.entity";
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('ai-conversations')
export class AiConversation {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ type: 'uuid', name: 'project_id' })
    projectId: string;

    @Column({ type: 'uuid', name: 'created_by' })
    createdBy: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => AiMessage, (aiMessage) => aiMessage.conversation)
    aiMessages: AiMessage[];

    @OneToOne(() => Project, (project) => project.aiConversation)
    project: Project;
}