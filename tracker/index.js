const sdk = require('aws-sdk');

const queueUrl = process.env.QUEUE_URL;

// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/sqs-examples-send-receive-messages.html
async function enqueueEvent(event) {
  const SQS = new sdk.SQS({});
  return await SQS.sendMessage({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(event)
  }).promise();
}

exports.handler = async (event) => {
  // console.log(JSON.stringify(event, null, 2));
  await enqueueEvent(JSON.parse(event.body));
  const response = {
    statusCode: 200,
    body: "ok",
  };
  return response;
};
