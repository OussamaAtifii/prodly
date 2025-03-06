import ProjectService from '@services/projectService';
import TaskService from '@services/taskService';
import { NextFunction, Request, Response } from 'express';

export default async function taskMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = Number(req.params.id);
  const userId = req.session.user?.id;

  try {
    if (!id) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const task = await TaskService.getTaskById(Number(id));

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await ProjectService.getById(task.projectId);

    // Check if the session user is the owner of the project
    if (project.userId !== Number(userId)) {
      return res.status(403).json({
        message: 'You do not have permission to perform this action',
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message:
        'An unexpected error occurred while processing the task request. Please try again later.',
    });
  }
}
