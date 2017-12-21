const client = require('./lib/funnelClient');
const convert = require('xml-js');

const pharmId = process.argv[2] || 'FJA60/1/';

async function getFromFunnelback(id) {
  try {
    const recordRaw = await client.getRecord(id);
    const record = JSON.parse(recordRaw);
    record.decodedContent = Buffer.from(record.pushContent.content, 'base64').toString('ascii');
    // const pharmacy = convert.xml2json(record.decodedContent, { compact: true, spaces: 4 });
    console.log(record.decodedContent);
  } catch (ex) {
    console.log(ex);
  }
}

getFromFunnelback(pharmId);
