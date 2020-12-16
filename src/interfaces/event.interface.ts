import {IBotProfile} from "./bot-profile.interface";

export interface IEvent {
    bot_id: string;
    type: string;
    text: string;
    user: string;
    ts: string;
    team: string;
    bot_profile: IBotProfile;
    channel: string;
    event_ts: string;
    channel_type: string;
}
