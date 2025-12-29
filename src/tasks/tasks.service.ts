import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskMapper } from './mappers/task.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>
  ) { }

  async create(createTaskDto: CreateTaskDto) {
    const task = this.taskRepository.create(createTaskDto);
    return TaskMapper.toResponse(await this.taskRepository.save(task));
  }

  async findAll() {
    return TaskMapper.toResponseList(await this.taskRepository.find());
  }

  async findOne(id: string) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new Error('Task not found');
    }
    return TaskMapper.toResponse(task);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new Error('Task not found');
    }
    await this.taskRepository.update({ id }, updateTaskDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new Error('Task not found');
    }
    await this.taskRepository.delete({ id });
    return TaskMapper.toResponse(task);
  }
}
