import { Request, Response } from 'express';
import { z } from 'zod';
import TaskService from '@services/taskService';
import ProjectService from '@services/projectService';
import { baseTaskSchema, taskUpdateSchema } from '@validations/TaskSchema';

class TaskController {
  static async getProjectTasks(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: 'Invalid project id' });
    }

    const project = await ProjectService.getById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const projectTags = await TaskService.getProjectTasks(id);

    return res.json(projectTags);
  }

  static async changeTaskStatus(req: Request, res: Response) {
    const taskId = Number(req.params.id);
    const { status } = req.body;

    if (!taskId) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const task = await TaskService.getTaskById(taskId);

    if (!task) {
      return res.status(400).json({ message: 'Task not found' });
    }

    try {
      const updatedTask = await TaskService.changeTaskStatus({
        taskId,
        status,
      });

      res.json(updatedTask);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: 'Error while updating task status' });
    }
  }

  static async getSummary(req: Request, res: Response) {
    const projectId = Number(req.params.id);

    if (!projectId) {
      return res.status(400).json({ message: 'Invalid project id' });
    }

    const project = await ProjectService.getById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const summary = await TaskService.getSummary(projectId);
    return res.json(summary);
  }

  static async create(req: Request, res: Response) {
    const data = req.body;
    const userId = req.session.user?.id;

    try {
      const validateTask = baseTaskSchema.parse(data);
      const existingProject = await ProjectService.getById(
        validateTask.projectId
      );

      if (!existingProject) {
        return res.status(404).json({ message: 'Project not found' });
      }

      if (existingProject.userId !== Number(userId)) {
        return res.status(403).json({
          message: 'You do not have permission to perform this action',
        });
      }

      const existingTask = await TaskService.getTaskByName(
        validateTask.title,
        validateTask.projectId
      );

      if (existingTask) {
        return res.status(409).json({ message: 'Task already exists' });
      }

      const task = await TaskService.createTask(validateTask);

      return res.status(201).json(task);
    } catch (error) {
      console.error(error);

      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => err.message);
        return res.status(400).json({ error: errorMessages });
      }

      return res.status(500).json({ message: 'Error creating tag' });
    }
  }

  static async update(req: Request, res: Response) {
    const data = req.body;
    const id = req.params.id;

    try {
      const validateTask = taskUpdateSchema.parse(data);
      const task = await TaskService.update(Number(id), validateTask);

      return res.json(task);
    } catch (error) {
      console.error(error);

      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => err.message);
        return res.status(400).json({ error: errorMessages });
      }

      return res.status(500).json({ message: 'Error updating task' });
    }
  }

  static async delete(req: Request, res: Response) {
    const id = req.params.id;

    try {
      await TaskService.delete(Number(id));
      return res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error(error);

      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => err.message);
        return res.status(400).json({ error: errorMessages });
      }

      return res.status(500).json({ message: 'Error deleting task' });
    }
  }
}

export default TaskController;
