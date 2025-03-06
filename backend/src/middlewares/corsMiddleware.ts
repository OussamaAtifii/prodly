import cors from 'cors';

export const corsMiddleware = cors({
  origin: process.env.API_URL,
  credentials: true,
});
