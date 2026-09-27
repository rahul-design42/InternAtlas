import { EmailProvider, EmailOptions } from './EmailProvider';

export class MockEmailProvider implements EmailProvider {
  async sendEmail(options: EmailOptions): Promise<void> {
    console.log(`\n========================================`);
    console.log(`✉️  [MOCK] EMAIL DISPATCHED TO: ${options.to}`);
    console.log(`========================================`);
    console.log(`SUBJECT: ${options.subject}`);
    console.log(`BODY: \n${options.body}`);
    console.log(`========================================\n`);
    
    // Simulate network delay
    return new Promise(resolve => setTimeout(resolve, 100));
  }
}
