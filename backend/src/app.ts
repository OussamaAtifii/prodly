import { corsMiddleware } from '@middlewares/corsMiddleware';
import membersRouter from '@routes/memberRoutes';
import projectRouter from '@routes/projectRoutes';
import taskRouter from '@routes/taskRoutes';
import userRouter from '@routes/userRoutes';
import cookieParser from 'cookie-parser';
import express, { Express, Response } from 'express';

const app: Express = express();

app.disable('x-powered-by');
app.use(express.json());
app.use(corsMiddleware);
app.use(cookieParser());

app.get('/', (_, res: Response) => res.status(200).send('Hello Prodly'));

app.use('/user', userRouter);
app.use('/projects', projectRouter);
app.use('/tasks', taskRouter);
app.use('/members', membersRouter);

export default app;
