import { Request, Response } from 'express';
import { invitationSchema } from '@validations/invitationSchema';
import z from 'zod';
import jwt from 'jsonwebtoken';
import { Invitation } from '@customTypes/invitation';
import UserService from '@services/userService';
import ProjectService from '@services/projectService';
import MemberService from '@services/memberService';
import { CLIENT_URL, JWT_SECRET_KEY } from 'src/config/config';
import { generateInvitationToken } from '@utils/generateInvitationToken';
import { sendProjectInviteEmail } from '@emails/inviteUser';

class MemberController {
  static async sendInvitation(req: Request, res: Response) {
    const data = req.body;
    const user = req.session.user;

    try {
      // Validate invitation data
      const validData = invitationSchema.parse(data);

      // Check if the user is inviting themselves
      if (validData.email === user?.email) {
        return res.status(400).json({ message: 'You cannot invite yourself' });
      }

      // Check if the user exists, if no user is found, send a 200 response but do not send any email
      const userToInvite = await UserService.getByEmail(validData.email);
      if (!userToInvite) {
        return res.status(200).json({ message: 'Email sent successfully' });
      }

      // Check if the projects still exists
      const project = await ProjectService.getById(validData.projectId);
      if (!project) {
        return res.status(404).json({ message: 'The project does not exist' });
      }

      // Check if the user is already a member of the project
      const member = await MemberService.getMember(
        userToInvite.id,
        validData.projectId
      );

      if (member) {
        return res
          .status(400)
          .json({ message: 'This user is already a member' });
      }

      // Generate token and invite link for the new member
      const token = generateInvitationToken(
        validData.projectId,
        validData.email
      );
      const inviteLink = `${CLIENT_URL}/accept-invitation?token=${token}`;

      // Send invitation email to the new member
      await sendProjectInviteEmail(validData.email, inviteLink);
      return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.log(error);

      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => err.message);
        return res.status(400).json({ error: errorMessages });
      }

      res.status(500).send('Error al enviar la invitación');
    }
  }

  static async acceptInvitation(req: Request, res: Response) {
    const data = req.body;
    const userId = Number(req.session.user?.id);

    try {
      // Validate token with data info
      const verified = jwt.verify(data.token, JWT_SECRET_KEY) as Invitation;

      // Get data of the authenticated user
      const userLogged = await UserService.getById(userId);

      // Check if the invitation email and user email are the same
      if (verified.email !== userLogged?.email) {
        return res
          .status(400)
          .json({ message: 'Error while accepting the invitation.' });
      }

      // Check if the user exists
      const user = await UserService.getByEmail(verified.email);
      if (!user) {
        return res
          .status(400)
          .json({ message: 'Error while accepting the invitation.' });
      }

      // Check if the project still exist
      const project = await ProjectService.getById(verified.projectId);
      if (!project) {
        return res
          .status(400)
          .json({ message: 'Error while accepting the invitation.' });
      }

      // Add user as a new member of the project
      await MemberService.addMember(user.id, project.id);
      return res
        .status(200)
        .json({ message: 'You have successfully accepted the invitation' });
    } catch (error) {
      console.log(error);
      res.status(500).send('Error while sending the invitation');
    }
  }

  static async getProjectMembers(req: Request, res: Response) {
    const id = Number(req.params.projectId);

    try {
      const members = await MemberService.getProjectMembers(id);
      res.send(members);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: 'Error occurred while retrieving project members' });
    }
  }
}

export default MemberController;
