import ProjectService from '@services/projectService';
import { NextFunction, Request, Response } from 'express';

export default async function projectMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = Number(req.params.id);
  const userId = req.session.user?.id;

  try {
    if (!id) {
      return res.status(400).json({ message: 'Invalid project id' });
    }

    const project = await ProjectService.getById(Number(id));

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

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
        'An unexpected error occurred while processing the project request. Please try again later.',
    });
  }
}
