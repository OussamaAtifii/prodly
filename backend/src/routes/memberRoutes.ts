import { Router } from 'express';
import authenticationMiddleware from '@middlewares/authenticationMiddleware';
import MemberController from '@controllers/memberController';

const membersRouter = Router();

membersRouter.post(
  '/send-invitation',
  authenticationMiddleware,
  MemberController.sendInvitation
);

membersRouter.post(
  '/accept-invitation',
  authenticationMiddleware,
  MemberController.acceptInvitation
);

membersRouter.get(
  '/:projectId',
  authenticationMiddleware,
  MemberController.getProjectMembers
);

export default membersRouter;
