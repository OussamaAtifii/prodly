import { z } from 'zod';

export const baseTaskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title is required')
    .min(5, 'Title must be at least 5 characters long')
    .max(50, 'Title cannot exceed 50 characters'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Priority is required',
  }),
  status: z.enum(['todo', 'process', 'done'], {
    required_error: 'Status is required',
  }),
  completed: z.boolean().optional(),
  projectId: z.number({ required_error: 'Project ID is required' }),
});

export const taskUpdateSchema = baseTaskSchema
  .omit({ projectId: true })
  .partial();
