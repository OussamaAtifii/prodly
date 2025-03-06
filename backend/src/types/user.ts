export interface UserData {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      session: {
        user: UserData | null;
      };
    }
  }
}
