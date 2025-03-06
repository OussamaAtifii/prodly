import { Task } from '@models/task.model';

export interface Priorities {
  value: Task['priority'];
  viewValue: string;
}
