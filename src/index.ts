import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import { notificationController } from './notifications/notification.controller';
import * as bodyParser from 'body-parser';

//For env File 
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.post('/', notificationController);
app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});