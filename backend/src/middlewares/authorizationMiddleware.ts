import { NextFunction, Request, Response } from 'express';

export default function authorizationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const userId = req.session.user?.id;

  try {
    if (String(id) !== String(userId)) {
      return res.status(403).json({
        message: "You don't have permission to perform this action",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: 'Error validating permissions',
    });
  }
}
