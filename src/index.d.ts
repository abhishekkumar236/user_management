export type jwtPayload = {
  id: number;
  user_role: 'admin' | 'user';
};

declare global {
  namespace Express {
    interface Request {
      user?: jwtPayload;
    }
  }
}
