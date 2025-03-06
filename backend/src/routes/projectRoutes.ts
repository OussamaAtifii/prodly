import { Router } from 'express';
import authenticationMiddleware from '@middlewares/authenticationMiddleware';
import ProjectController from '@controllers/projectController';
import projectMiddleware from '@middlewares/projectMiddleware';

const projectRouter = Router();

projectRouter.use(authenticationMiddleware);

projectRouter.get('/', ProjectController.getAllUserProjects);

projectRouter.get('/summary', ProjectController.getSummary);

projectRouter.post('/', ProjectController.createProject);

projectRouter.patch('/:id', projectMiddleware, ProjectController.update);

projectRouter.delete(
  '/:id',
  projectMiddleware,
  ProjectController.deleteProject
);

export default projectRouter;
