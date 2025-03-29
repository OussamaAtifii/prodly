import { z } from 'zod';

export const invitationSchema = z.object({
  projectId: z.number(),
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .max(244, 'Email cannot exceed 244 characters')
    .email('The email address is invalid')
    .toLowerCase(),
});
