import { Router } from 'express';
import TaskController from '@controllers/taskController';
import authenticationMiddleware from '@middlewares/authenticationMiddleware';
import taskMiddleware from '@middlewares/taskMiddleware';

const taskRouter = Router();

taskRouter.use(authenticationMiddleware);

taskRouter.get('/projects/:id', TaskController.getProjectTasks);
taskRouter.get('/summary/:id', TaskController.getSummary);
taskRouter.post('/', TaskController.create);
taskRouter.patch('/:id', taskMiddleware, TaskController.update);
taskRouter.patch(
  '/status/:id',
  taskMiddleware,
  TaskController.changeTaskStatus
);
taskRouter.delete('/:id', taskMiddleware, TaskController.delete);
taskRouter.get('/stats', TaskController.getStats);

export default taskRouter;
