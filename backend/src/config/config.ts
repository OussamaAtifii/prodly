import dotenv from 'dotenv';

// Load env variables from .env
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const JWT_SECRET_KEY =
  process.env.JWT_SECRET_KEY || 'default-secret-key';

export const EMAIL_PASS = process.env.EMAIL_PASS || '';

export const CLIENT_URL = process.env.CLIENT_URL;
export const EMAIL_USER = process.env.EMAIL_USER;
