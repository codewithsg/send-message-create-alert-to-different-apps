import TelegramBot from 'node-telegram-bot-api';
import { INotificationEmailConfiguration, TNotificationConfig } from '../types/notification.types';
import nodemailer from 'nodemailer';
import fetch, { Response } from 'node-fetch';

/**
 *
 * @param token token is webhook api
 * @param message
 * TO GET DISCORD TOKEN
 * CREATE/SELECT A SERVER
 * SELECT A SETTING OF CHANNEL YOU NEED TO RECEIVE MESSAGE TO
 * THEN GO TO INTEGRATIONS
 * USE THE WEBHOOKS as TOKEN
 */
export const sendMessageToDiscordChannel = async (token: string, message: string): Promise<Response> => {
  const response = await fetch(token, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: message }),
  });
  if (!response.ok) {
    throw new Error('Failed to send message.');
  }

  return response;
};

/**
 *
 * @param token
 * @param message
 * TO GET TELEGRAM TOKEN, LOGIN TO TELEGRAM
 * GO TO BOTFATHER AND CREATE NEW BOT USING COMMAND /newbot
 * ON CREATION OF BOT YOU WILL BE PROVIDED WITH TOKEN, USE THIS TOKEN AS ACCESS TOKEN
 * USE THE NEW BOT IN YOUR CHAT YOU WANT TO RECEIVE MESSSAGE TO
 * FOR CHANNEL LINK, YOU DEFINE CHANNEL LINK WHILE CREATING CHANNEL. CHANNEL LINK LOOKS LIKE THIS: t.me/testChannel
 */
export const sendMessageToTelegramChat = (notificationConfig: TNotificationConfig, message: string) => {
  const bot = new TelegramBot(notificationConfig.access_token);

  return bot.sendMessage(notificationConfig.channel, message);
};

/**
 *
 * @param notificationConfig
 * @param messgae
 * TO USE SLACK FIRST GO TO THIS LINK:  https://api.slack.com/apps
 * CREATE AN APP
 * SELECT FROM SCRATCH
 * GIVE APP NAME AND WORKSPACE THEN CREATE APP
 * GO TO FEATURES -> INCOMING WEBHOOKS -> ACTIVATE WEBHOOKS
 * AT THE BOTTOM CLICK ADD NEW WEBHOOKS TO WORKSPACE
 * SELECT CHANNEL AND CLICK ALLOW
 * WEBHOOK IS CREATED, COPY THE WEBHOOK AND USE IT FOR NOTIFICATION
 */
export const sendMessageToSlack = async (notificationConfig: TNotificationConfig, messgae: string): Promise<Response> => {
  const response = await fetch(notificationConfig.webhook, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ text: messgae }),
  });
  if (!response.ok) {
    throw new Error('Failed to send message.');
  }

  return response;
};

/**
 *
 * @param emailConfiguration
 * @param message
 * CREATE TEAMS
 * INTEGRATION -> ADD INTEGRATION
 * COPY THE API KEY
 */
export const sendAlertToOpsgenie = async (notificationConfig: TNotificationConfig, message: string): Promise<Response> => {
  const response = await fetch('https://api.opsgenie.com/v2/alerts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: notificationConfig.api_token,
    },
    body: JSON.stringify({
      message: message,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to create alert.');
  }
  return response;
};

/**
 *
 * @param notificationConfig
 * @param message
 * CREATE AN API TOKEN FROM -> https://id.atlassian.com/manage-profile/security/api-tokens
 * FOR PRODUCT KEY, CLICK PROJECT , YOU CAN FIND KEY ON THE LIST OF PROJECTS
 * FOR APP_NAME, YOU CAN FIND APP_NAME ON URL LIKE https://<app-name>.atlassian.net LIKE test-asm.atlassian.net HERE test-asm is APP_NAME
 */
export const createIssueToJira = async (notificationConfig: TNotificationConfig, message: string): Promise<Response> => {
  const response = await fetch(`https://test-asm.atlassian.net/rest/api/2/issue/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: notificationConfig.base64,
    },
    body: JSON.stringify({
      fields: {
        project: {
          key: notificationConfig.project_key,
        },
        summary: message,
        issuetype: {
          name: 'Bug',
        },
        reporter: {
          id: notificationConfig.reporter,
        },
      },
    }),
  });

  await response.json();
  if (!response.ok) {
    throw new Error('Failed to create alert.');
  }
  return response;
};

export const sendMessageToEmail = (emailConfiguration: INotificationEmailConfiguration) => {
  return mailTransporter.sendMail(emailConfiguration);
};

export const checkProjectIdForJira = async (notificationConfig: TNotificationConfig): Promise<Response> => {
  const project = await fetch(
    `https://${notificationConfig.app_name}.atlassian.net/rest/api/2/project/${notificationConfig.project_key}`,
    {
      method: 'GET',
      headers: {
        Authorization: notificationConfig.base64,
      },
    }
  );

  return project;
};

export const transportConfig = {
  host: process.env.NODEMAILER_HOST,
  port: Number(process.env.NODEMAILER_PORT) || 465,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
};

export const mailTransporter = nodemailer.createTransport(transportConfig);