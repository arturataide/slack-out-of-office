import { Event } from '../entities/event.entity';
import { IBody } from '../interfaces/body.interface';
import { IBotData } from '../interfaces/bot-data.interface';
import { fromUnixTime, isWeekend, isWithinInterval } from 'date-fns';

export class BotHelper {
  static isChallenge(body: IBody): boolean {
    return !!body.challenge;
  }

  static isBot(event: Event): boolean {
    return !!event.botId && !!event.botProfile;
  }

  static isOutOfOffice(eventTs: string, botData: IBotData): boolean {
    const messageDateTime: Date = fromUnixTime(parseInt(eventTs));
    return (
      !isWithinInterval(messageDateTime, {
        start: botData.startWorkShift,
        end: botData.endWorkShift,
      }) || isWeekend(messageDateTime)
    );
  }
}
