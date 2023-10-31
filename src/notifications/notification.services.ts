import { TNotificationConfig } from "../types/notification.types";
import { NotificationType } from "../utils/enums";
import { createIssueToJira, sendAlertToOpsgenie, sendMessageToDiscordChannel, sendMessageToEmail, sendMessageToSlack, sendMessageToTelegramChat } from "../utils/notifications";

export const sendMessage = (notificationType: NotificationType, notificationConfig: TNotificationConfig, message: string, subject?: string) => {
  if (notificationType === NotificationType.DISCORD && message) {
    return sendMessageToDiscordChannel(notificationConfig.webhook, message);
  } else if (notificationType === NotificationType.TELEGRAM && message) {
    return sendMessageToTelegramChat(notificationConfig, message);
  } else if (notificationType === NotificationType.SLACK && message) {
    return sendMessageToSlack(notificationConfig, message);
  } else if (notificationType === NotificationType.OPSGENIE && message) {
    return sendAlertToOpsgenie(notificationConfig, message);
  } else if (notificationType === NotificationType.JIRA && message) {
    return createIssueToJira(notificationConfig, message);
  } else if (notificationType === NotificationType.EMAIL && message && subject) {
    return sendMessageToEmail({
      to: notificationConfig.jira_account_email,
      from: `${process.env.NODEMAILER_MAIL}`,
      subject,
      html: `<strong>${message}</strong>`,
    });
  } else {
    throw new Error('Cannot send message, use correct notification type method or send message.');
  }

  return;
}