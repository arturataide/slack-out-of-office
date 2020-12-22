export class BotProfile {
  id: string;
  deleted: boolean;
  name: string;
  updated: number;
  appId: string;
  icons: Array<string>;
  teamId: string;

  constructor(obj: Partial<BotProfile>) {
    Object.assign(this, {
      ...obj,
      appId: obj['app_id'],
      teamId: obj['team_id'],
    });
  }
}
