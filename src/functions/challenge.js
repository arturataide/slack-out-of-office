exports.handler = async (event) => {
    return {
        statusCode: 200,
        body: event.body.challenge,
    }
}
