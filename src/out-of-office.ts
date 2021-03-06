import { APIGatewayEvent } from 'aws-lambda';
import { Event } from './entities/event.entity';
import { BotHelper } from './helpers/bot.helper';
import { MessageHelper } from './helpers/message.helper';
import { IBody } from './interfaces/body.interface';
import { IBotData } from './interfaces/bot-data.interface';
import { set } from 'date-fns';
import { IResponse } from './interfaces/response.interface';

/**
 * @description Netlify function handler. This method is accessed when thr function is triggered.
 * @param apiEvent
 */
export async function handler(apiEvent: APIGatewayEvent): Promise<IResponse> {
  const body: IBody = JSON.parse(apiEvent.body);
  const outOfOfficeBot: OutOfOfficeBot = new OutOfOfficeBot();
  return outOfOfficeBot.pleaseWork(body);
}

export class OutOfOfficeBot {
  /**
   * @private
   * @description Get the bot token from environmental variables
   * @returns string containing the bot token
   */
  private static get token(): string {
    return process.env.TOKEN;
  }

  /**
   * @description Get the signing secret from environmental variables
   * @returns string containing the signing secret
   */
  private static get signingSecret(): string {
    return process.env.SIGNING_SECRET;
  }

  /**
   * @description Get the bot_text from environmental variables
   * @returns string containing the bot text
   */
  private static get botText(): string {
    return process.env.BOT_TEXT;
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

  public async pleaseWork(body: IBody): Promise<IResponse> {
    return BotHelper.isChallenge(body)
      ? OutOfOfficeBot.sendResponse({ challenge: body.challenge })
      : await this.processMessage(body);
  }

  /**
   * TODO: Method to big. proper split this
   * @param body
   * @private
   */
  private async processMessage(body: IBody): Promise<IResponse> {
    const event: Event = new Event(body.event);
    // check if it is out of office time
    if (BotHelper.isOutOfOffice(event.eventTs, OutOfOfficeBot.botData)) {
      // Do nothing is message comes from a bot
      if (BotHelper.isBot(event)) {
        return OutOfOfficeBot.sendResponse({
          message: 'Message sent from a bot. No action performed',
        });
      }
      console.log('MESSAGE RECEIVED: ', event);
      // This prevents to re-send a message in case of edit
      if (!!event.text) {
        await MessageHelper.publishMessage(
          OutOfOfficeBot.token,
          OutOfOfficeBot.signingSecret,
          event.channel,
          OutOfOfficeBot.botText,
          event.eventTs,
        );
        return OutOfOfficeBot.sendResponse({ message: 'Out Of Office Message Send' });
      }
      return OutOfOfficeBot.sendResponse({ message: 'Message not sent. It was an edit' });
    }
    return OutOfOfficeBot.sendResponse({
      message: 'We are in working hours. No action performed',
    });
  }

  private static sendResponse(body: { message?: string; challenge?: string }): IResponse {
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 200,
      body: JSON.stringify(body),
    };
  }
}
