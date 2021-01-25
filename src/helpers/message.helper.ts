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
    console.log('SENDING MESSAGE!');
    try {
      await app.client.chat.postMessage({
        token,
        channel,
        text,
        icon_emoji: ':clock1:',
        thread_ts: threadTs,
      });
      console.log('MESSAGE SENT!');
    } catch (error) {
      console.error('MESSAGE ERROR', error);
    }
  }
}
