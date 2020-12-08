import {createEventAdapter} from "@slack/events-api";
import {constants} from "./constants";
import {WebClient} from "@slack/web-api";

const slackEvents = createEventAdapter(constants.OAUTH_TOKEN);
const webClient = new WebClient(constants.OAUTH_TOKEN);

// All errors in listeners are caught here. If this weren't caught, the program would terminate.
slackEvents.on('error', (error) => {
    console.error('ERROR: ,', error.name); // TypeError
});

slackEvents.on('message', (event, body) => {
    console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
    console.log(body);
});

(async () => {
    const server = await slackEvents.start(constants.PORT);
    console.log(`Listening for events on ${server.address().port}`);
    sendMessage('#basically-testing-slack-features', 'This is my first message').then(res => console.log(res));
})();

async function sendMessage(channel, text) {
    await webClient.chat.postMessage({
        channel,
        text
    })
}

