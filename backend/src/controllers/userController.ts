import { Request, Response } from 'express';
import {
  userRegisterSchema,
  userLoginSchema,
  userProfileUpdateSchema,
} from '@validations/UserSchema';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config/config';
import UserService from '@services/userService';

class UserController {
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAll();

      return res.status(200).json(users);
    } catch (error) {
      console.error(error);

      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => err.message);
        return res.status(400).json({ error: errorMessages });
      }

      return res.status(500).json({ message: 'Error fetching users' });
    }
  }

  static async getUserById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const user = await UserService.getById(Number(id));

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error(error);

      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => err.message);
        return res.status(400).json({ error: errorMessages });
      }

      return res.status(500).json({ message: 'Error fetching user' });
    }
  }

  static async register(req: Request, res: Response) {
    const data = req.body;
    let error = [];

    try {
      const validatedUser = userRegisterSchema.parse(data);
      const usernameExist = await UserService.getByUsername(
        validatedUser.username
      );
      const emailExist = await UserService.getByEmail(validatedUser.email);

      if (usernameExist) {
        error.push('Username already exists');
      }

      if (emailExist) {
        error.push('Email already exists');
      }

      if (error.length > 0) {
        return res.status(409).json({ error });
      }

      const saltRounds = 10;
      const hassedPassword = await bcrypt.hash(
        validatedUser.password,
        saltRounds
      );

      validatedUser.password = hassedPassword;

      const user = await UserService.create(validatedUser);

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );

      const { id, username, email, role, avatar } = user;
      return res
        .status(201)
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          maxAge: 3600000,
        })
        .json({ id, username, email, role, avatar });
    } catch (error) {
      console.error(error);

      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => err.message);
        return res.status(400).json({ error: errorMessages });
      }

      return res.status(500).json({ message: 'Error updating user' });
    }
  }

  static async login(req: Request, res: Response) {
    const data = req.body;
    const password = req.body.password;
    try {
      const validatedUser = userLoginSchema.parse(data);
      const userExist = await UserService.getByEmail(validatedUser.email);
      const passwordCorrect =
        userExist === null
          ? false
          : await bcrypt.compare(password, userExist.password);

      if (!(userExist && passwordCorrect)) {
        return res
          .status(401)
          .json({ error: true, message: 'invalid user or password' });
      }
      const token = jwt.sign(
        { id: userExist.id, email: userExist.email, role: userExist.role },
        JWT_SECRET_KEY,
        {
          expiresIn: '1h',
        }
      );

      const { id, username, email, role, avatar } = userExist;
      return res
        .status(200)
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          maxAge: 3600000,
        })
        .json({ id, username, email, role, avatar });
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => err.message);
        return res.status(400).json({ error: errorMessages });
      }
      return res.status(500).json({ message: 'Error on login' });
    }
  }

  static async logout(req: Request, res: Response) {
    return res
      .status(200)
      .clearCookie('token')
      .json({ message: 'Logout success' });
  }

  static async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;

    try {
      const validatedUser = userProfileUpdateSchema.parse(data);
      const user = await UserService.update(Number(id), validatedUser);
      const { password, ...userWithoutPassword } = user;

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error(error);

      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => err.message);
        return res.status(400).json({ error: errorMessages });
      }

      return res.status(500).json({ message: 'Error updating user' });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const user = await UserService.delete(Number(id));

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(204).send();
    } catch (error) {
      console.error(error);

      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => err.message);
        return res.status(400).json({ error: errorMessages });
      }

      return res.status(500).json({ message: 'Error deleting user' });
    }
  }

  static async checkSession(req: Request, res: Response) {
    const userId = req.session.user?.id;

    try {
      const userExist = await UserService.getById(Number(userId));
      if (userExist) {
        return res.json(userExist);
      }

      return res.send().status(401);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error while validating session' });
    }
  }
}

export default UserController;
