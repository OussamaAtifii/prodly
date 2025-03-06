import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Task, TaskUpdateStatus } from '../../../models/task.model';
import { ProjectService } from '../../projects/services/project.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private API_URL = `${environment.API_URL}/tasks`;
  private httpClient = inject(HttpClient);
  private projectService = inject(ProjectService);

  getProjectTasks(projectId: number) {
    return this.httpClient.get<{
      todo: Task[];
      process: Task[];
      done: Task[];
    }>(`${this.API_URL}/projects/${projectId}`, {
      withCredentials: true,
    });
  }

  createTask(task: Task) {
    const projectId = this.projectService.project()?.id;

    if (!projectId) {
      console.log('There is no project selected');
    }

    return this.httpClient.post<Task>(
      `${this.API_URL}`,
      { ...task, projectId },
      { withCredentials: true },
    );
  }

  updateTask(id: number, taskData: Partial<Omit<Task, 'id'>>) {
    return this.httpClient.patch(`${this.API_URL}/${id}`, taskData, {
      withCredentials: true,
    });
  }

  deleteTask(id: number) {
    return this.httpClient.delete(`${this.API_URL}/${id}`, {
      withCredentials: true,
    });
  }

  changeTaskStatus({ id, status }: TaskUpdateStatus) {
    return this.httpClient.patch(
      `${this.API_URL}/status/${id}`,
      { status },
      { withCredentials: true },
    );
  }
}
