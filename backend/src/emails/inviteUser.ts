import { EMAIL_USER } from 'src/config/config';
import { inviteTemplate } from './templates/inviteTemplate';
import { transporter } from './transporter';

/**
 * Sends an invitation email to the especifies recipient.
 *
 * @param inviteEmail The email address to send the invitation to
 * @param inviteLink The link containing the invitation token
 */
export const sendProjectInviteEmail = async (
  inviteEmail: string,
  inviteLink: string
) => {
  await transporter.sendMail({
    from: EMAIL_USER,
    to: inviteEmail,
    subject: 'You have been invited to a project!',
    html: inviteTemplate(inviteLink),
  });
};
