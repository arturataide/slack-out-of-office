exports.handler = async (event) => {
    console.log('EVENT ', event);
    return {
        statusCode: 200,
        body: event.body.challenge,
    }
}
