import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskMapper } from './mappers/task.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { TaskException } from 'src/common/exceptions/task.exception';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private eventsService: EventsService
  ) { }

  async create(createTaskDto: CreateTaskDto, userId: string) {
    if (!createTaskDto.assignedToId) {
      createTaskDto = {
        ...createTaskDto,
        assignedToId: userId,
      }
    }

    const dto = {
      ...createTaskDto,
      createdById: userId,
    }

    const task = this.taskRepository.create(dto);

    const lastPosition = await this.taskRepository.findOne({
      where: { listId: createTaskDto.listId },
      order: { position: 'DESC' }
    });
    task.position = lastPosition ? lastPosition.position + 1 : 0;

    this.eventsService.emit({
      message: 'A task was added',
      data: task,
    });

    return TaskMapper.toResponse(await this.taskRepository.save(task));
  }

  async findAll(listId: string) {
    const tasks = await this.taskRepository.find({ where: { listId } })
    return TaskMapper.toResponseList(tasks);
  }

  async findOne(id: string) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new TaskException('Task not found');
    }
    return TaskMapper.toResponse(task);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new TaskException('Task not found');
    }
    await this.taskRepository.update({ id }, updateTaskDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new TaskException('Task not found');
    }
    await this.taskRepository.delete({ id });
    return TaskMapper.toResponse(task);
  }
}
