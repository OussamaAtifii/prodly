import cors from 'cors';
import { CLIENT_URL } from 'src/config/config';

export const corsMiddleware = cors({
  origin: CLIENT_URL,
  credentials: true,
});
