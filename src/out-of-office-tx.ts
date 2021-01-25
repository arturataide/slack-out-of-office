import { APIGatewayEvent } from 'aws-lambda';
import { IBody } from './interfaces/body.interface';
import { OutOfOfficeBot } from './out-of-office';

// handler for tx while they did not fork the project
export async function handler(apiEvent: APIGatewayEvent): Promise<unknown> {
  const body: IBody = JSON.parse(apiEvent.body);
  const outOfOfficeBot: OutOfOfficeBot = new OutOfOfficeBot();
  return outOfOfficeBot.pleaseWork(body);
}
