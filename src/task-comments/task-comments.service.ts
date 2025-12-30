import { Injectable } from '@nestjs/common';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { UpdateTaskCommentDto } from './dto/update-task-comment.dto';
import { TaskComment } from './entities/task-comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskCommentMapper } from './mappers/task-comments.mapper';
import { TaskCommentsException } from 'src/common/exceptions/task-comments.exception';

@Injectable()
export class TaskCommentsService {
  constructor(
    @InjectRepository(TaskComment)
    private readonly taskCommentRepository: Repository<TaskComment>,
  ) { }

  async create(createTaskCommentDto: CreateTaskCommentDto) {
    const taskComment = this.taskCommentRepository.create(createTaskCommentDto);
    return TaskCommentMapper.toResponse(await this.taskCommentRepository.save(taskComment));
  }

  async findAll() {
    return TaskCommentMapper.toResponseList(await this.taskCommentRepository.find());
  }

  async findOne(id: string) {
    const taskComment = await this.taskCommentRepository.findOne({ where: { id } });

    if (!taskComment) {
      throw new TaskCommentsException(`TaskComment with id ${id} not found`);
    }

    return TaskCommentMapper.toResponse(taskComment);
  }

  async update(id: string, updateTaskCommentDto: UpdateTaskCommentDto) {
    const taskComment = await this.taskCommentRepository.findOne({ where: { id } });

    if (!taskComment) {
      throw new TaskCommentsException(`TaskComment with id ${id} not found`);
    }

    await this.taskCommentRepository.update(id, updateTaskCommentDto);

    return this.findOne(id);
  }

  async remove(id: string) {
    const taskComment = await this.taskCommentRepository.findOne({ where: { id } });

    if (!taskComment) {
      throw new TaskCommentsException(`TaskComment with id ${id} not found`);
    }

    await this.taskCommentRepository.remove(taskComment);
    return TaskCommentMapper.toResponse(taskComment);
  }
}
