import express, { Express, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import membersRouter from '@routes/memberRoutes';
import userRouter from '@routes/userRoutes';
import projectRouter from '@routes/projectRoutes';
import taskRouter from '@routes/taskRoutes';
import { corsMiddleware } from '@middlewares/corsMiddleware';
import { PORT } from './config/config';

const app: Express = express();

app.disable('x-powered-by');

app.use(express.json());
app.use(corsMiddleware);
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello World');
});

app.use('/user', userRouter);
app.use('/projects', projectRouter);
app.use('/tasks', taskRouter);
app.use('/members', membersRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
