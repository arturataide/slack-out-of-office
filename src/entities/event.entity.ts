import { IBotProfile } from '../interfaces/bot-profile.interface';

export class Event {
  // nothing more needed for now
  botId?: string;
  text: string;
  ts: string;
  botProfile?: IBotProfile;
  channel: string;
  eventTs: string;
  channelType: string;

  constructor(obj: unknown) {
    Object.assign(this, {
      botId: !!obj['bot_id'] ? obj['bot_id'] : null,
      text: obj['text'],
      ts: obj['ts'],
      botProfile: !!obj['bot_profile'] ? obj['bot_profile'] : null,
      eventTs: obj['event_ts'],
      channelType: obj['channel_type'],
    });
  }
}
