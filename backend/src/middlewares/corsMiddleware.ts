import cors from 'cors';

export const corsMiddleware = cors({
  origin: 'http://localhost:4200',
  credentials: true,
});
