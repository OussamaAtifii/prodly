import { z } from 'zod';

export const baseUserSchema = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters long')
    .max(16, 'Username cannot exceed 16 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .max(244, 'Email cannot exceed 244 characters')
    .email('The email address in invalid')
    .toLowerCase(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .max(255, 'Password cannot exceed 255 characters'),
  avatar: z.string().optional(),
});

// Rules for user registration.
export const userRegisterSchema = baseUserSchema.pick({
  username: true,
  email: true,
  password: true,
});

// Rules for user login.
export const userLoginSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).toLowerCase(),
  password: z.string({ required_error: 'Password is required' }),
});

// Rules for updating user profile.
export const userProfileUpdateSchema = baseUserSchema.partial();
