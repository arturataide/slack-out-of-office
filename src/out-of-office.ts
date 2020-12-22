import { APIGatewayEvent } from 'aws-lambda';
import { Event } from './entities/event.entity';
import { BotHelper } from './helpers/bot.helper';
import { MessageHelper } from './helpers/message.helper';
import { IBody } from './interfaces/body.interface';
import { IBotData } from './interfaces/bot-data.interface';
import { set } from 'date-fns';

// main function handler
export async function handler(apiEvent: APIGatewayEvent): Promise<unknown> {
  const body: IBody = JSON.parse(apiEvent.body);
  const outOfOfficeBot: OutOfOfficeBot = new OutOfOfficeBot();
  return outOfOfficeBot.pleaseWork(body);
}

export class OutOfOfficeBot {
  private static get token(): string {
    return process.env.TOKEN;
  }

  private static get signingSecret(): string {
    return process.env.SIGNING_SECRET;
  }

  private static get botData(): IBotData {
    const startWorkingHours: Array<number> = process.env.START_SHIFT.split(':').map((value: string) => parseInt(value));
    const endWorkingHours: Array<number> = process.env.END_SHIFT.split(':').map((value: string) => parseInt(value));
    return {
      startWorkShift: set(new Date(), { hours: startWorkingHours[0], minutes: startWorkingHours[1] }),
      endWorkShift: set(new Date(), { hours: endWorkingHours[0], minutes: endWorkingHours[1] }),
      text: process.env.BOT_TEXT,
    };
  }

  public async pleaseWork(body: IBody): Promise<unknown> {
    console.log('ENV_VARS', process.env.START_SHIFT, process.env.START_SHIFT, process.env.BOT_TEXT);
    console.log('EVENT', body.event, );
    const event: Event = new Event(body.event);
    console.log('EVENT', event);
    return BotHelper.isChallenge(body)
      ? this.sendResponse({ challenge: body.challenge })
      : await this.processMessage(event);
  }

  public async processMessage(event: Event): Promise<unknown> {
    // check if it is out of office time
    if (BotHelper.isOutOfOffice(event.eventTs, OutOfOfficeBot.botData)) {
      // Do nothing is message comes from a bot
      if (BotHelper.isBot(event)) {
        return this.sendResponse({
          message: 'Message sent from a bot. No action performed',
        });
      }
      console.log('SENDING MESSAGE');
      await MessageHelper.publishMessage(
        OutOfOfficeBot.token,
        OutOfOfficeBot.signingSecret,
        event.channel,
        'We are out of the office currently. We will reply as soon as possible.',
        event.eventTs,
      );
      return this.sendResponse({ message: 'Out Of Office Message Send' });
    }
    return this.sendResponse({
      message: 'We are in working hours. No action performed',
    });
  }

  public sendResponse(body: unknown): unknown {
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 200,
      body: JSON.stringify(body),
    };
  }
}
