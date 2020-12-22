import { Event } from '../entities/event.entity';
import { IBody } from '../interfaces/body.interface';
import { IBotData } from '../interfaces/bot-data.interface';
import { isWeekend, isWithinInterval, set } from 'date-fns';

export class BotHelper {
  static isChallenge(body: IBody): boolean {
    return !!body.challenge;
  }

  static isBot(event: Event): boolean {
    return !!event.botId && !!event.botProfile;
  }

  static isOutOfOffice(messageDateTime: Date): boolean {
    console.log('RECEIVED AT: ', messageDateTime);
    console.log('TEST: ', new Date());
    console.log('START AT: ', BotHelper.getBotData().startWorkingShift);
    console.log('END AT: ', BotHelper.getBotData().endWorkingShift);
    return (
      isWithinInterval(messageDateTime, {
        start: BotHelper.getBotData().startWorkingShift,
        end: BotHelper.getBotData().endWorkingShift,
      }) || isWeekend(messageDateTime)
    );
  }

  // TODO
  static getBotData(): IBotData {
    return {
      startWorkingShift: set(new Date(), { hours: 7, minutes: 30 }),
      endWorkingShift: set(new Date(), { hours: 17, minutes: 30 }),
      phrase: 'Hey',
    };
  }
}
