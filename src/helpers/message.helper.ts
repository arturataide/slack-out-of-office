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
    try {
      // Call the chat.postMessage method using the built-in WebClient
      const result = await app.client.chat.postMessage({
        // The token you used to initialize your app
        token,
        channel,
        text,
        icon_emoji: ':clock1:',
        thread_ts: threadTs,
        // You could also use a blocks[] array to send richer content
      });

      // Print result, which includes information about the message (like TS)
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}
