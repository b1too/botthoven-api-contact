import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import ConfirmationEmail from '../emails/ConfirmationEmail';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  async sendConfirmation(opts: {
    to: string;
    name: string;
    locale: 'es' | 'en';
    services: { name: string }[];
  }) {
    const html = render(ConfirmationEmail({
      name: opts.name,
      locale: opts.locale,
      services: opts.services,
      appUrl: process.env.APP_URL
    }));

    const subject = opts.locale === 'en'
      ? 'We received your request'
      : 'Hemos recibido tu solicitud';

    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: opts.to,
      subject,
      html,
    });
  }
}
