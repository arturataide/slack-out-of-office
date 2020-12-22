import { BotProfile } from './bot-profile.entity';

export class Event {
  botId: string;
  type: string;
  text: string;
  user: string;
  ts: string;
  team: string;
  botProfile?: BotProfile;
  channel: string;
  eventTs: string;
  channelType: string;

  constructor(obj: Partial<Event>) {
    Object.assign(this, {
      ...obj,
      botId: obj['bot_id'],
      botProfile: obj['bot_profile'],
      eventTs: obj['event_ts'],
      channelType: obj['channel_type'],
    });
  }
}
