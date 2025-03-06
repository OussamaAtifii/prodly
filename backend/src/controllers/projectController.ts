import { Request, Response } from 'express';
import { z } from 'zod';
import ProjectService from '@services/projectService';
import {
  baseProjectSchema,
  projectUpdateSchema,
} from '@validations/ProjectSchema';
import TaskService from '@services/taskService';
import { Summary } from '@types/summary';

class ProjectController {
  static async getAllUserProjects(req: Request, res: Response) {
    try {
      const userId = req.session.user?.id;
      const userProjects = await ProjectService.getAllUserProjects(
        Number(userId)
      );

      return res.status(200).json(userProjects);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching user projects' });
    }
  }

  static async getSummary(req: Request, res: Response) {
    try {
      const userId = Number(req.session.user?.id);
      const userProjects = await ProjectService.getAllUserProjects(userId);

      const summary: Summary = {
        completed: { previous: 0, current: 0, percentage: 0 },
        inProcess: { previous: 0, current: 0, percentage: 0 },
        created: { previous: 0, current: 0, percentage: 0 },
      };

      const projectsSummaries = await Promise.all(
        userProjects.map((project) => TaskService.getSummary(project.id))
      );

      for (const project of projectsSummaries) {
        summary.completed.current += project.actualMonthTasks.completed;
        summary.completed.previous += project.previousMonthTasks.completed;

        summary.inProcess.current += project.actualMonthTasks.inProcess;
        summary.inProcess.previous += project.previousMonthTasks.inProcess;

        summary.created.current += project.actualMonthTasks.created;
        summary.created.previous += project.previousMonthTasks.created;
      }

      const calculatePercentage = (current: number, previous: number) => {
        if (previous === 0) return 0;
        return Math.floor(((current - previous) / previous) * 100);
      };

      summary.completed.percentage = calculatePercentage(
        summary.completed.current,
        summary.completed.previous
      );
      summary.created.percentage = calculatePercentage(
        summary.created.current,
        summary.created.previous
      );
      summary.inProcess.percentage = calculatePercentage(
        summary.inProcess.current,
        summary.inProcess.previous
      );

      return res.status(200).json(summary);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching summary' });
    }
  }

  static async createProject(req: Request, res: Response) {
    const data = req.body;
    const userId = req.session.user?.id;

    try {
      const validateProject = baseProjectSchema.parse({ ...data, userId });
      const existingProject = await ProjectService.getByName(
        Number(userId),
        validateProject.name
      );

      if (existingProject) {
        return res.status(409).json({ message: 'Project already exists' });
      }

      const project = await ProjectService.create(validateProject);
      return res.json(project);
    } catch (error) {
      console.error(error);

      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => err.message);
        return res.status(400).json({ error: errorMessages });
      }

      return res.status(500).json({ message: 'Error creating project' });
    }
  }

  static async update(req: Request, res: Response) {
    const projectData = req.body;
    const projectId = Number(req.params.id);

    try {
      const validateProject = projectUpdateSchema.parse(projectData);
      const project = await ProjectService.updateProject(
        projectId,
        validateProject
      );

      return res.json(project);
    } catch (error) {
      console.log(error);

      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => err.message);
        return res.status(400).json({ error: errorMessages });
      }

      return res.status(500).json({ message: 'Error updating project' });
    }
  }

  static async deleteProject(req: Request, res: Response) {
    const id = req.params.id;

    try {
      await ProjectService.deleteProject(Number(id));
      return res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      console.error(error);

      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => err.message);
        return res.status(400).json({ error: errorMessages });
      }

      return res.status(500).json({ message: 'Error deleting project' });
    }
  }
}

export default ProjectController;
