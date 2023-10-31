import { Request, Response } from 'express';
import { sendMessage } from './notification.services';

export const notificationController = async (req: Request, res: Response) => {
  try {
    console.log('req.body::', req.body);
    const data = await sendMessage(req.body.notificationType, req.body.notificationConfig, req.body.message, req.body.subject);

    res.send('Successfully send message.')
  } catch (err: any) {
    console.log('error::', err)
    throw Error(err.toString());
  }
}