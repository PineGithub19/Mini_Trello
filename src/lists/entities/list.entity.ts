import { Project } from "src/projects/entities/project.entity";
import { Task } from "src/tasks/entities/task.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('lists')
export class List {
    @PrimaryGeneratedColumn("uuid", { name: "id" })
    id: string;

    @Column({ type: 'uuid', name: 'project_id' })
    projectId: string;

    @Column({ length: 255, type: 'varchar', name: 'title' })
    title: string;

    @Column({ type: "smallint", name: 'position' })
    position: number;

    @Column({ type: "timestamp", name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: "timestamp", name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => Project, (project) => project.lists, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @OneToMany(() => Task, (task) => task.list, { onDelete: 'CASCADE' })
    tasks: Task[];
}