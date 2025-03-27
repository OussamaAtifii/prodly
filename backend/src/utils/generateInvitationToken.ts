import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from 'src/config/config';

/**
 * Generates a JWT token for an invitation with a specific project ID and email.
 *
 * @param {number} projectId - The ID of the project for which the invitation is being generated.
 * @param {string} email - The email address of the user being invited to the project.
 * @returns {string} - A JWT token that can be used to verify the invitation and its validity.
 */
export const generateInvitationToken = (projectId: number, email: string) => {
  const token = jwt.sign({ projectId, email }, JWT_SECRET_KEY, {
    expiresIn: '2d',
  });

  return token;
};
