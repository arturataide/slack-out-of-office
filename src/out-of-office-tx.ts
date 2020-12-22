import { APIGatewayEvent } from 'aws-lambda';
import { IBody } from './interfaces/body.interface';
import { OutOfOfficeBot } from './out-of-office';

// handler for tx while they did not fork the project
export async function handler(apiEvent: APIGatewayEvent): Promise<unknown> {
  console.log('BOT', apiEvent);
  const body: IBody = JSON.parse(apiEvent.body);
  console.log('BOT', body);
  const outOfOfficeBot: OutOfOfficeBot = new OutOfOfficeBot();
  return outOfOfficeBot.pleaseWork(body);
}
