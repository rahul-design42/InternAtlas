// eslint-disable-next-line @typescript-eslint/no-require-imports
const nodemailer = require('nodemailer');
import { EmailProvider, EmailOptions } from './EmailProvider';
import { config } from '../../config/env';

/**
 * SMTP Email Provider
 * Uses Nodemailer to dispatch emails via any SMTP server.
 * 
 * STATUS: IMPLEMENTED — NOT LIVE VERIFIED
 * Credentials must be provided via:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM
 * 
 * The abstraction is complete and will dispatch real emails
 * once credentials are supplied and EMAIL_PROVIDER=smtp is set.
 */
export class SmtpEmailProvider implements EmailProvider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private transporter: any;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.smtpHost,
      port: config.email.smtpPort,
      secure: config.email.smtpPort === 465,
      auth: {
        user: config.email.smtpUser,
        pass: config.email.smtpPass,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    if (!config.email.smtpHost || !config.email.smtpUser || !config.email.smtpPass) {
      console.error('[SmtpEmailProvider] SMTP credentials not configured. Skipping send.');
      return;
    }

    try {
      await this.transporter.sendMail({
        from: config.email.fromAddress,
        to: options.to,
        subject: options.subject,
        text: options.body,
        html: options.html || options.body.replace(/\n/g, '<br>'),
      });
      // Log success but never log credentials or recipient details in production
      console.log(`[Email] Dispatched to recipient via SMTP. Subject: ${options.subject}`);
    } catch (error: any) {
      // Log error without exposing credentials or sensitive data
      console.error(`[Email] SMTP send failed: ${error.code || error.message}`);
      throw new Error('Email dispatch failed');
    }
  }
}
