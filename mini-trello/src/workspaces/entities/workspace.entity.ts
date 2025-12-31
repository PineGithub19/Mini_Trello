import { Project } from "src/projects/entities/project.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('workspaces')
export class Workspace {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'name' })
    name: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ type: 'uuid', name: 'owner_id' })
    ownerId: string;

    @ManyToOne(() => User, (user) => user.workspaces, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'owner_id', referencedColumnName: 'id' })
    owner: User;

    @OneToMany(() => Project, (project) => project.workspace, { onDelete: 'CASCADE' })
    projects: Project[];
}
