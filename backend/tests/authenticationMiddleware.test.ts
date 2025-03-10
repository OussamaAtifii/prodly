import authenticationMiddleware from '../src/middlewares/authenticationMiddleware';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../src/config/config';

describe('Authentication Middleware', () => {
  it('should return 401 if no token is provided', () => {
    const req = { cookies: {} } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    authenticationMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token not provided' });
  });
});

describe('Authentication Middleware', () => {
  it('should call next() when token is provided', () => {
    const validToken = jwt.sign(
      { id: 1, email: 'test@test.com', role: 'user' },
      JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    const req = { cookies: { token: validToken } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    authenticationMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
