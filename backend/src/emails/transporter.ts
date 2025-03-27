import nodemailer from 'nodemailer';
import { EMAIL_PASS, EMAIL_USER } from 'src/config/config';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});
