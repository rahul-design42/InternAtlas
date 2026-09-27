import { EmailProvider } from './EmailProvider';
import { MockEmailProvider } from './MockEmailProvider';
import { SmtpEmailProvider } from './SmtpEmailProvider';
import { config } from '../../config/env';

// Provider is selected via EMAIL_PROVIDER env var
// EMAIL_PROVIDER=mock    → MockEmailProvider (default, development)
// EMAIL_PROVIDER=smtp    → SmtpEmailProvider (production, requires SMTP_* vars)
let emailProvider: EmailProvider;

switch (config.email.provider) {
  case 'smtp':
    emailProvider = new SmtpEmailProvider();
    break;
  case 'mock':
  default:
    emailProvider = new MockEmailProvider();
    break;
}

export const sendEmail = async (to: string, subject: string, body: string): Promise<void> => {
  // Validate recipient before dispatching
  if (!to || !to.includes('@')) {
    console.error(`[Email] Skipping email — invalid recipient: ${to}`);
    return;
  }
  return emailProvider.sendEmail({ to, subject, body });
};

