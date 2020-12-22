import { APIGatewayEvent, Context } from 'aws-lambda';
import { Event } from './entities/event.entity';
import { BotHelper } from './helpers/bot.helper';
import { MessageHelper } from './helpers/message.helper';
import { IBody } from './interfaces/body.interface';

const { TOKEN, SIGNING_SECRET } = process.env;

export async function handler(apiEvent: APIGatewayEvent, context: Context): Promise<unknown> {
  const body: IBody = JSON.parse(apiEvent.body);
  const event: Event = new Event(body.event);
  console.log(body.event, '\nevent', event);
  return BotHelper.isChallenge(body) ? sendResponse({ challenge: body.challenge }) : await processMessage(event);
}

async function processMessage(event: Event) {
  const { channel, eventTs } = event;
  const messageDateTime = new Date(parseInt(eventTs) * 1000);
  console.log('[TIMESTAMP]: ', eventTs, messageDateTime, ' => CHANNEL:', channel);
  if (BotHelper.isOutOfOffice(messageDateTime)) {
    if (BotHelper.isBot(event)) {
      return sendResponse({
        message: 'Message sent from a bot. No action performed',
      });
    }
    console.log('SENDING MESSAGE');
    // TODO: check if message comes from bot (bot_profile is present)
    await MessageHelper.publishMessage(
      TOKEN,
      SIGNING_SECRET,
      channel,
      'We are out of the office currently. We will reply as soon as possible.',
      eventTs,
    );
    return sendResponse({ message: 'Out Of Office Message Send' });
  }
  return sendResponse({
    message: 'We are in working hours. No action performed',
  });
}

function sendResponse(body) {
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    statusCode: 200,
    body: JSON.stringify(body),
  };
}
