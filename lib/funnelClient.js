const request = require('request');
const jsontoxml = require('jsontoxml');

const token = process.env.FUN_TOKEN;
const collection = process.env.FUN_COLLECTION || 'mark-test-xml';
const url = `https://nhs-dev-search01.squiz.co.uk/push-api/v1/collections/${collection}/documents?`;

function putOptions(record, mimeType, encoder) {
  return {
    method: 'PUT',
    url: `${url}key=${record.url}`,
    headers: {
      'content-type': mimeType,
      // use generated token for access
      'x-security-token': token,
      // set geoposition as header metadata
      'X-Funnelback-Push-Meta-Data-geoPosition': record.geoPosition,
    },
    body: encoder(record),
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

function wrapXml(record) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="no" ?><pharmacy>${jsontoxml(record)}</pharmacy>`;
}

async function putRecordAsXml(record) {
  return new Promise((resolve, reject) => {
    request(putOptions(record, 'application/xml', wrapXml), (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

async function putRecordAsJson(record) {
  return new Promise((resolve, reject) => {
    request(putOptions(record, 'application/json', JSON.stringify), (error, response, body) => {
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
  putRecordAsJson,
  putRecordAsXml,
  getRecord
};
