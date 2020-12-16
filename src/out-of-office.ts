import {App, LogLevel} from "@slack/bolt";
import {APIGatewayEvent, Context} from 'aws-lambda'
import {IEvent} from "./interfaces/event.interface";

const {TOKEN, SIGNING_SECRET} = process.env

export async function handler(
    event: APIGatewayEvent,
    context: Context
) {
    console.log('EVENT\n', event);
    const body = JSON.parse(event.body);
    console.log('BODY\n', body);
    return isChallenge(body) ? sendResponse({challenge: body.challenge}) : await processMessage(body.event);
}

async function processMessage(event: IEvent) {
    console.log('BODY EVENT\n', event);
    const {channel, event_ts} = event;
    const messageDateTime = new Date( parseInt(event_ts) * 1000)
    console.log('CHANNEL', channel);
    console.log('TIMESTAMP', event_ts, messageDateTime);
    if (isOutOfOffice(messageDateTime)) {
        if (isBot(event)) {
            return sendResponse({message: "Message sent from a bot. No action performed"});
        }
        console.log('SENDING MESSAGE');
        // TODO: check if message comes from bot (bot_profile is present)
        await publishMessage(channel, 'We are out of the office currently. We will reply as soon as possible.', event_ts)
        return sendResponse({message: "Out Of Office Message Send"});
    }
    return sendResponse({message: "We are in working hours. No action performed"});
}

function isChallenge(body) {
    return ("challenge" in body)
}

function isBot(event: IEvent) {
    return "bot_profile" in event;
}

function isOutOfOffice(messageDateTime: Date) {
    const hourStart = 17;
    const hourEnd = 7;
    // also weekends
    // TODO: Make timezone aware
    console.log('RECEIVED AT: ', messageDateTime.getHours());
    return messageDateTime.getHours() >= hourStart && messageDateTime.getHours() < hourEnd
}

// Post a message to a channel your app is in using ID and message text
async function publishMessage(channel: string, text: string, thread_ts: string) {
    const app = new App({
        token: TOKEN,
        signingSecret: SIGNING_SECRET,
        // LogLevel can be imported and used to make debugging simpler
        logLevel: LogLevel.DEBUG
    });
    try {
        // Call the chat.postMessage method using the built-in WebClient
        const result = await app.client.chat.postMessage({
            // The token you used to initialize your app
            token: TOKEN,
            channel,
            text,
            icon_emoji: ':clock1:',
            thread_ts
            // You could also use a blocks[] array to send richer content
        });

        // Print result, which includes information about the message (like TS)
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

function sendResponse(body) {
    return {
        headers: {
            "Content-Type": "application/json"
        },
        statusCode: 200,
        body: JSON.stringify(body)
    }
}

