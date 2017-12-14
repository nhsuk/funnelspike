const client = require('./lib/funnelClient');

async function getFromFunnelback(id) {
  try {
    const recordRaw = await client.getRecord(id);
    const record = JSON.parse(recordRaw);
    record.decodedContent = Buffer.from(record.pushContent.content, 'base64').toString('ascii');
    console.log(record.decodedContent);
  } catch (ex) {
    console.log(ex);
  }
}

getFromFunnelback('FWM71');
