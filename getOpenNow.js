const request = require('request');

const collection = process.env.FUN_COLLECTION || 'mark-test-xml';
const minutesInADay = 1440;

const urlStart = `https://nhs-dev-search01.squiz.co.uk/s/search.json?collection=${collection}&query=altDate:weekly`;

function getOptions(time) {
  const timeRange = `&ge_closes=${time}&le_opens=${time}`;
  const geoRange = '&maxdist=32.19&origin=54.159074,-0.897925&sort=prox';
  const url = urlStart + timeRange + geoRange;
  console.log(url);
  return {
    method: 'get',
    url,
    headers: {
      'content-type': 'application/json'
    },
    strictSSL: false
  };
}
function getMinutesOffset(dayCount, timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return (minutesInADay * dayCount) + (hours * 60) + minutes;
}

async function search() {
  const time = getMinutesOffset(1, '09:00');
  return new Promise((resolve, reject) => {
    request.get(getOptions(time), (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

async function openNow() {
  const res = await search();
  // const resultsSummary = JSON.parse(res).response.resultPacket.resultsSummary;
  const results = JSON.parse(res).response.resultPacket.results;
  console.log(results.map(r => r.metaData));
}

openNow();
/*
service.distanceInMiles
service.name
service.address
service.contacts
service.identifier
*/
