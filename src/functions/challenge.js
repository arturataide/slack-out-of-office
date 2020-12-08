const {App, LogLevel} = require("@slack/bolt");
const { TOKEN, SIGNING_SECRET} = process.env

exports.handler = async (req) => {
    console.log('REQ', req);
    console.log('###################################');
    console.log('REQ BODY', req.body);
    console.log('###################################');
    console.log('EVENT BODY', req.body["event"]);

    const event = req.body["event"];
    const {channel, event_ts} = event.event;

    console.log('CHANNEL', channel);
    console.log('Timestamp', event_ts,  new Date(event_ts));
    publishMessage(channel, 'This is my simple reply :)')
    return {
        statusCode: 200,
        body: req.body,
    }
}

// Post a message to a channel your app is in using ID and message text
async function publishMessage(channel, text) {
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
            text
            // You could also use a blocks[] array to send richer content
        });

        // Print result, which includes information about the message (like TS)
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}
