import { set, getUnixTime } from 'date-fns';
import { Event } from '../../entities/event.entity';
import { IBody } from '../../interfaces/body.interface';
import { IBotData } from '../../interfaces/bot-data.interface';

export const botMessageEventPayload: Event = new Event({
  bot_id: 'bot_id',
  text: 'This is my simple reply :)',
  ts: '1607952072.008700',
  bot_profile: {
    id: 'bot_id',
  },
  channel: 'C01FWQ5PKKR',
  eventTs: '1607952072.008700',
  channelType: 'channel',
});

export const userMessageEventPayload: Event = new Event({
  text: 'This is my simple reply :)',
  ts: '1607952072.008700',
  channel: 'C01FWQ5PKKR',
  eventTs: '1607952072.008700',
  channelType: 'channel',
});

export const challengeMessagePayload: IBody = {
  challenge: 'challenge1',
};

export const botDataPayload: IBotData = {
  startWorkShift: set(new Date(), { hours: 7, minutes: 30 }),
  endWorkShift: set(new Date(), { hours: 17, minutes: 30 }),
  text: 'Bot Message',
};

export const workingHours: string = getUnixTime(set(new Date(), { hours: 10 })).toString();
export const outOfWorkingHours: string = getUnixTime(set(new Date(), { hours: 18 })).toString();
