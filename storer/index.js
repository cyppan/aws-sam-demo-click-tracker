// code adapted from https://github.com/aws-samples/amazon-elasticsearch-lambda-samples
const AWS = require('aws-sdk');
const path = require('path');

/* == Globals == */
const esDomain = {
  region: 'eu-west-1',
  endpoint: 'search-events-koo6ooxcx6jlssuvwdc2ljmbn4.eu-west-1.es.amazonaws.com',
  index: 'events'
};
const endpoint = new AWS.Endpoint(esDomain.endpoint);
/*
 * The AWS credentials are picked up from the environment.
 * They belong to the IAM role assigned to the Lambda function.
 * Since the ES requests are signed using these credentials,
 * make sure to apply a policy that allows ES domain operations
 * to the role.
 */
const creds = new AWS.EnvironmentCredentials('AWS');

/*
 * Bulk post the given documents to Elasticsearch
 */
async function bulkPostToES(docs) {
  return new Promise((resolve, reject) => {
    const req = new AWS.HttpRequest(endpoint);

    req.method = 'POST';
    req.path = path.join('/', esDomain.index, '_bulk');
    req.region = esDomain.region;
    req.headers['presigned-expires'] = false;
    req.headers['Host'] = endpoint.host;
    req.headers['Content-Type'] = 'application/x-ndjson';
    req.body = '';
    for (let doc of docs) {
      req.body += '{"index":{}}\n';
      req.body += `${JSON.stringify(doc)}\n`;
    }

    const signer = new AWS.Signers.V4(req, 'es');  // es: service code
    signer.addAuthorization(creds, new Date());

    const send = new AWS.NodeHttpClient();
    send.handleRequest(req, null, function (httpResp) {
      let respBody = '';
      httpResp.on('data', function (chunk) {
        respBody += chunk;
      });
      httpResp.on('end', function (chunk) {
        if (![200, 201].includes(httpResp.statusCode)) {
          reject(`${httpResp.statusMessage} ${respBody}`);
        } else {
          resolve(respBody);
        }
      });
    }, function (err) {
      reject(err);
    });
  });
}

/* Lambda "main": Execution begins here */
exports.handler = async function (event) {
  console.log(JSON.stringify(event, null, 2));
  const events = event.Records.map(record => JSON.parse(record.body));
  const esResp = await bulkPostToES(events);
  console.log(esResp);
  return {
    status: 200,
    body: "ok"
  }
};
