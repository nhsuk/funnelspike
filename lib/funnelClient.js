const request = require('request');

const token = process.env.FUN_TOKEN;
const collection = process.env.FUN_COLLECTION || 'mark-test';
const url = `https://nhs-dev-search01.squiz.co.uk/push-api/v1/collections/${collection}/documents?`;

function putOptions(id, record) {
  return {
    method: 'PUT',
    url: `${url}key=http%3A%2F%2F${id}%2F`,
    headers: {
      'content-type': 'application/json',
      // use generated token for access
      'x-security-token': token,
      // set geoposition as header metadata
      'X-Funnelback-Push-Meta-Data-geoPosition': record.geoPosition,
    },
    body: JSON.stringify(record),
    // disable SSL as site does not have a valid SSL certificate
    strictSSL: false
  };
}

function getOptions(id) {
  return {
    method: 'get',
    url: `${url}key=http%3A%2F%2F${id}%2F`,
    headers: {
      'content-type': 'application/json',
      'x-security-token': token,
    },
    strictSSL: false
  };
}

async function putRecord(id, record) {
  return new Promise((resolve, reject) => {
    request(putOptions(id, record), (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

async function getRecord(id) {
  return new Promise((resolve, reject) => {
    request(getOptions(id), (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

module.exports = {
  putRecord,
  getRecord
};
