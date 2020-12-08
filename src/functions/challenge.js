const {App, LogLevel} = require("@slack/bolt");
const { TOKEN, SIGNING_SECRET} = process.env

exports.handler = async (event) => {

    const app = new App({
        token: TOKEN,
        signingSecret: SIGNING_SECRET,
        // LogLevel can be imported and used to make debugging simpler
        logLevel: LogLevel.DEBUG
    });
    console.log('VARS', TOKEN, SIGNING_SECRET);
    console.log('EVENT BODY', event.body);
    return {
        statusCode: 200,
        body: event.body,
    }
}

// Post a message to a channel your app is in using ID and message text
async function publishMessage(id, text) {
    try {
        // Call the chat.postMessage method using the built-in WebClient
        const result = await app.client.chat.postMessage({
            // The token you used to initialize your app
            token: TOKEN,
            channel: id,
            text: text
            // You could also use a blocks[] array to send richer content
        });

        // Print result, which includes information about the message (like TS)
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}
