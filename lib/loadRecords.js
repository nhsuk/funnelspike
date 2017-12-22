const async = require('async');
const client = require('./funnelClient');
const transform = require('./transform');
const unwind = require('./unwind');
const dataRaw = transform(require('../pharmacy-data'));

const data = unwind(dataRaw, 'openingTimesAsOffset');
let count = 0;
let format = 'json';

function getGeoPosition(coordinates) {
  return `${coordinates[1]};${coordinates[0]}`;
}

async function loadToFunnelback(record, callback) {
  try {
    const geoPosition = record.location && getGeoPosition(record.location.coordinates);
    // eslint-disable-next-line
    record.geoPosition = geoPosition;
    if (format === 'xml') {
      await client.putRecordAsXml(record);
    } else {
      await client.putRecordAsJson(record);
    }
    count += 1;
    if (count % 10 === 0) {
      console.log(count);
    }
  } catch (ex) {
    console.log(ex);
  }
  callback();
}

function queueIds(q) {
  data.forEach((record) => {
    q.push(record);
  });
}

function loadRecords(recordFormat) {
  format = recordFormat;
  count = 0;
  const workers = 6;
  const q = async.queue(loadToFunnelback, workers);
  queueIds(q);
  q.drain = () => {
    console.log('done!');
  };
}

module.exports = loadRecords;
