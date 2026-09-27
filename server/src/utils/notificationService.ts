import { Notification, User } from '../models';
import { sendEmail } from '../services/email';

/**
 * Creates an in-app notification and dispatches an email (mocked).
 */
export const notifyUser = async (
  userId: string | any,
  type: 'APPLICATION_UPDATE' | 'NEW_MESSAGE' | 'SYSTEM_ALERT' | 'OPPORTUNITY_MATCH' | 'NEW_APPLICATION',
  title: string,
  message: string,
  link?: string
) => {
  try {
    // 1. Create In-App Notification
    await Notification.create({
      userId,
      type,
      title,
      message,
      link
    });

    // 2. Fetch user to send email
    const user = await User.findById(userId);
    if (!user) return;

    // 3. Dispatch Email via abstraction
    const emailBody = `Hi there,\n\n${message}\n\n${link ? `View here: ${link}` : ''}`;
    await sendEmail(user.email, title, emailBody);

  } catch (error) {
    console.error('Failed to dispatch notification:', error);
  }
};
