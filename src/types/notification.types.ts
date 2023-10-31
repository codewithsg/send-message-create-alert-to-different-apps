export type TNotificationConfig = {
  webhook: string;
  access_token: string;
  channel: string;
  api_token: string;
  jira_account_email: string;
  project_key: string;
  base64: string;
  app_name: string;
  issue_type: string;
  reporter: string;
}

export interface INotificationEmailConfiguration {
  from: string;
  to: string;
  subject: string;
  html: string;
}
