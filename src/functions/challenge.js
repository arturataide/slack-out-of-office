exports.handler = async (event) => {
    console.log('EVENT Body', event.body);
    console.log('EVENT Challange', event.body["challenge"]);
    return {
        statusCode: 200,
        body: event.body["challenge"],
    }
}
