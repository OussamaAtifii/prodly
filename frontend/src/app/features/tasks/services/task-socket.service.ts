import { inject, Injectable } from '@angular/core';
import { SocketService } from '@features/events/socket.service';
import { Task } from '@models/task.model';
import { Socket } from 'socket.io-client';
import { TaskEventPayload } from '../models/task-event.model';

const TASK_EVENTS = {
  CREATED: 'task:created',
  UPDATED: 'task:updated',
  DELETED: 'task:deleted',
  CREATED_NOTIFY: 'task:created:notify',
  UPDATED_NOTIFY: 'task:updated:notify',
  DELETED_NOTIFY: 'task:deleted:notify',
};

@Injectable({
  providedIn: 'root',
})
export class TaskSocketService {
  private socketService = inject(SocketService);
  private socket: Socket;

  constructor() {
    this.socket = this.socketService.instance;
  }

  emitTaskCreated(taskEvent: TaskEventPayload) {
    this.socket.emit(TASK_EVENTS.CREATED, taskEvent);
  }

  emitTaskUpdated(taskEvent: TaskEventPayload) {
    this.socket.emit(TASK_EVENTS.UPDATED, taskEvent);
  }

  emitTaskDeleted(taskEvent: TaskEventPayload) {
    this.socket.emit(TASK_EVENTS.DELETED, taskEvent);
  }

  onTaskCreated(callback: (task: Task) => void) {
    this.socket.on(TASK_EVENTS.CREATED_NOTIFY, callback);
  }

  onTaskUpdated(callback: (task: Task) => void) {
    this.socket.on(TASK_EVENTS.UPDATED_NOTIFY, callback);
  }

  onTaskDeleted(callback: (task: Task) => void) {
    this.socket.on(TASK_EVENTS.DELETED_NOTIFY, callback);
  }
}
