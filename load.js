const async = require('async');
const client = require('./lib/funnelClient');
const transform = require('./lib/transform');
const data = transform(require('./pharmacy-data'));

let count = 0;

function getGeoPosition(coordinates) {
  return `${coordinates[1]};${coordinates[0]}`;
}

async function loadToFunnelback(record, callback) {
  try {
    const geoPosition = record.location && getGeoPosition(record.location.coordinates);
    // eslint-disable-next-line
    record.geoPosition = geoPosition;
    await client.putRecord(record.identifier, record);
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

function loadRecords() {
  count = 0;
  const workers = 4;
  const q = async.queue(loadToFunnelback, workers);
  queueIds(q);
  q.drain = () => {
    console.log('done!');
  };
}

loadRecords();

module.exports = loadRecords;
