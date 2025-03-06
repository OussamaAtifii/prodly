import { and, desc, eq } from 'drizzle-orm';
import { InsertTask, SelectTask, tasksTable } from '@db/schema';
import { db } from '@db/index';

class TaskService {
  static async getProjectTasks(projectId: number) {
    const tasks = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.projectId, projectId))
      .orderBy(desc(tasksTable.createdAt));

    const groupedTasks = tasks.reduce((acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }

      acc[task.status].push(task);

      return acc;
    }, {} as Record<string, SelectTask[]>);

    return groupedTasks;
  }

  static async getTaskByName(name: string, projectId: number) {
    const [task] = await db
      .select()
      .from(tasksTable)
      .where(
        and(eq(tasksTable.title, name), eq(tasksTable.projectId, projectId))
      );

    return task;
  }

  static async getTaskById(taskId: number) {
    const [task] = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.id, taskId));

    return task;
  }

  static async getSummary(projectId: number) {
    const tasks = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.projectId, projectId));

    const actualMonth = new Date().getMonth();

    const previousMonthTasks = tasks.filter((task) => {
      const date = new Date(task.createdAt.replace(' ', 'T'));
      return date.getMonth() === actualMonth - 1;
    });

    const actualMonthTasks = tasks.filter((task) => {
      const date = new Date(task.createdAt.replace(' ', 'T'));
      return date.getMonth() === actualMonth;
    });

    const summary = {
      previousMonthTasks: {
        completed: previousMonthTasks.filter((task) => task.status === 'done')
          .length,
        inProcess: previousMonthTasks.filter(
          (task) => task.status === 'process'
        ).length,
        created: previousMonthTasks.length,
      },
      actualMonthTasks: {
        completed: actualMonthTasks.filter((task) => task.status === 'done')
          .length,
        inProcess: actualMonthTasks.filter((task) => task.status === 'process')
          .length,
        created: actualMonthTasks.length,
      },
    };

    return summary;
  }

  static async changeTaskStatus({
    taskId,
    status,
  }: {
    taskId: number;
    status: 'todo' | 'process' | 'done';
  }) {
    const [task] = await db
      .update(tasksTable)
      .set({ status })
      .where(eq(tasksTable.id, taskId))
      .returning();

    return task;
  }

  static async createTask(data: InsertTask) {
    const [tag] = await db.insert(tasksTable).values(data).returning();
    return tag;
  }

  static async update(taskId: number, data: Partial<Omit<SelectTask, 'id'>>) {
    const [task] = await db
      .update(tasksTable)
      .set(data)
      .where(eq(tasksTable.id, taskId))
      .returning();
    return task;
  }

  static async delete(taskId: number) {
    await db.delete(tasksTable).where(eq(tasksTable.id, taskId));
  }
}

export default TaskService;
