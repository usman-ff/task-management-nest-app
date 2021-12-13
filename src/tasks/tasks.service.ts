import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getAllTasks(user: User): Promise<Task[]> {
    return await this.taskRepository.find({ user });
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const foundTask = await this.taskRepository.findOne({
      where: { id, user },
    });
    if (!foundTask) {
      throw new NotFoundException('Task with the given ID ' + id);
    } else {
      return foundTask;
    }
  }

  async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: string, user: User): Promise<Task> {
    const task = this.getTaskById(id, user);
    await this.taskRepository.delete({ id, user });
    return task;
  }

  async editTaskById(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }
}
