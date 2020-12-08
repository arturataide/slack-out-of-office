exports.handler = async (event) => {
    console.log('EVENT', event);
    console.log('EVENT BODY', event.body);
    return {
        statusCode: 200,
        body: event.body,
    }
}
