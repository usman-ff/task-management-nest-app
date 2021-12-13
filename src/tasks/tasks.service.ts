import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  async getTaskById(id: string): Promise<Task> {
    const foundTask = await this.taskRepository.findOne(id);
    if (!foundTask) {
      throw new NotFoundException(
        'Task with the given ID ' + id + ' does not Exist',
      );
    } else {
      return foundTask;
    }
  }

  async createTask(createTaskDto: CreateTaskDTO): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async deleteTask(id: string): Promise<Task> {
    const task = this.getTaskById(id);
    await this.taskRepository.delete(id);
    return task;
  }

  async editTaskById(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    console.log(task);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }
}
