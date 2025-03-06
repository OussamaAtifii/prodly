export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'process' | 'done';
  completed: boolean;
}

export interface Tasks {
  todo: Task[];
  process: Task[];
  done: Task[];
}

export type TaskUpdateStatus = Pick<Task, 'id' | 'status'>;
