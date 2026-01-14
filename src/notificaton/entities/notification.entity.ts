import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum NotificationType {
    TASK_ASSIGNED = 'TASK_ASSIGNED',
    TASK_UPDATED = 'TASK_UPDATED',
    TASK_DELETED = 'TASK_DELETED',
}

@Entity('notification')
export class Notification {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ type: 'varchar', length: 255, name: 'title' })
    title: string;

    @Column({ type: 'varchar', length: 255, name: 'content' })
    content: string;

    @Column({ type: 'enum', enum: NotificationType, name: 'type' })
    type: NotificationType;

    @Column({ type: 'boolean', name: 'is_read', default: false })
    isRead: boolean;

    @Column({ type: 'uuid', name: 'user_id' })
    userId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.notifications)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;
}
