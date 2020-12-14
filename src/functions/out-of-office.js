const {App, LogLevel} = require("@slack/bolt");
const {TOKEN, SIGNING_SECRET} = process.env

exports.handler = async ({body}) => {
    body = JSON.parse(body);
    console.log('REQ BODY', body);
    return isChallenge(body) ? sendResponse({challenge: body.challenge}) : await processMessage(body);
}

async function processMessage(body) {
    const {channel, event_ts} = body.event;
    const messageDateTime = new Date(event_ts * 1000)
    console.log('CHANNEL', channel);
    console.log('TIMESTAMP', event_ts, messageDateTime);
    if (isOutOfOffice(messageDateTime)) {
        console.log('SENDING MESSAGE');
        // TODO: check if message comes from bot (bot_profile is present)
        await publishMessage(channel, 'This is my simple reply :)')
        return sendResponse({message: "Out Of Office Message Send"});
    }
    return sendResponse({message: "We are in working hours. No action done"});
}

function isChallenge(body) {
    return ("challenge" in body)
}

function isOutOfOffice(messageDateTime) {
    const hourStart = 9;
    const hourEnd = 18
    console.log('RECEIVED AT: ', messageDateTime.getHours());
    return messageDateTime.getHours() >= hourStart && messageDateTime.getHours() < hourEnd
}

// Post a message to a channel your app is in using ID and message text
async function publishMessage(channel, text) {
    const app = new App({
        /*token: TOKEN,*/
        token: "xoxb-1540817314855-1541377982951-Q24WbVzyS8c0BcsR8DpQG2KN",
        /*signingSecret: SIGNING_SECRET,*/
        signingSecret: "275f57c935216d207c6eb09fd08c07bc",
        // LogLevel can be imported and used to make debugging simpler
        logLevel: LogLevel.DEBUG
    });
    try {
        // Call the chat.postMessage method using the built-in WebClient
        const result = await app.client.chat.postMessage({
            // The token you used to initialize your app
            token: TOKEN,
            channel,
            text
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
        statusCode: 200,
        body: JSON.stringify(body)
    }
}

