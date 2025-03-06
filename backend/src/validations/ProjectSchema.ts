import { z } from 'zod';

export const baseProjectSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Name is required')
    .min(5, 'Name must be at least 5 characters long')
    .max(30, 'Name cannot exceed 30 characters'),
  color: z
    .string()
    .regex(
      /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
      'Color must be a valid hex code'
    )
    .optional(),
  userId: z.number(),
});

export const projectUpdateSchema = baseProjectSchema
  .omit({ userId: true })
  .partial();
