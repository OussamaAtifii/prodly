import { Task } from '@models/task.model';

export interface TaskEventPayload {
  projectId: number;
  task: Task;
}
