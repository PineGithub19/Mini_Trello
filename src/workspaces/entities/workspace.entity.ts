import { Project } from "src/projects/entities/project.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('workspaces')
export class Workspace {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ type: 'varchar', length: 255, name: 'name' })
    name: string;

    @Column({ type: 'varchar', length: 255, name: 'background', nullable: true, default: null })
    background: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    @Column({ type: 'uuid', name: 'owner_id' })
    ownerId: string;

    @ManyToOne(() => User, (user) => user.workspaces, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'owner_id', referencedColumnName: 'id' })
    owner: User;

    @OneToMany(() => Project, (project) => project.workspace, { onDelete: 'CASCADE' })
    projects: Project[];
}
