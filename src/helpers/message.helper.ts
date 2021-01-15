import { App, LogLevel } from '@slack/bolt';

export class MessageHelper {
  // Post a message to a channel your app is in using ID and message text
  static async publishMessage(
    token: string,
    signingSecret: string,
    channel: string,
    text: string,
    threadTs: string,
  ): Promise<void> {
    const app = new App({
      token,
      signingSecret,
      // LogLevel can be imported and used to make debugging simpler
      logLevel: LogLevel.DEBUG,
    });
    console.log('PublishMessage', channel, text);
    console.log('PublishMessage', token, channel);
    try {
      const result = await app.client.chat.postMessage({
        token,
        channel,
        text: 'test',
        icon_emoji: ':clock1:',
        thread_ts: threadTs,
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}
