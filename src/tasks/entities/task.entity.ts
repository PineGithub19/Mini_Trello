import { List } from "src/lists/entities/list.entity";
import { Project } from "src/projects/entities/project.entity";
import { TaskComment } from "src/task-comments/entities/task-comment.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ length: 255, type: 'varchar', name: 'title' })
  title: string;

  @Column({ type: 'text', name: 'description', default: "" })
  description: string;

  @Column({ type: 'timestamp', name: 'due_date', nullable: true, default: () => "CURRENT_TIMESTAMP + INTERVAL '1 day'", })
  dueDate: Date | null;

  @Column({ type: 'enum', enum: TaskStatus, name: 'status', default: TaskStatus.TODO })
  status: TaskStatus;

  @Column({ type: 'enum', enum: TaskPriority, name: 'priority', default: TaskPriority.LOW })
  priority: TaskPriority;

  @Column({ type: 'smallint', name: 'position' })
  position: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'uuid', name: 'list_id' })
  listId: string;

  @ManyToOne(() => List, (list) => list.tasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'list_id' })
  list: List;

  /* ---------------- CREATED BY ---------------- */

  @Column({ type: 'uuid', name: 'created_by' })
  createdById: string;

  @ManyToOne(() => User, (user) => user.createdTasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  /* ---------------- ASSIGNED TO ---------------- */

  @Column({ type: 'uuid', name: 'assigned_to' })
  assignedToId: string;

  @ManyToOne(() => User, (user) => user.assignedTasks, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'assigned_to' })
  assignedTo: User;

  /* ---------------- COMMENTS ---------------- */

  @OneToMany(() => TaskComment, (taskComment) => taskComment.task)
  comments: TaskComment[];
}

