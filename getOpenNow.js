const request = require('request');

const collection = process.env.FUN_COLLECTION || 'mark-test-xml';
let time = 8000;
const minutesInADay = 1440;

const urlStart = `https://nhs-dev-search01.squiz.co.uk/s/search.json?collection=${collection}&query=!FunDoesNotExist:PadreNul`;
const timeRange = `&ge_closes=${time}&le_opens=${time}`;
const geoRange = '&maxdist=32.19&origin=54.159074,-0.897925&sort=prox';
const url = urlStart + timeRange + geoRange;

function getOptions() {
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
function getMinutesOffset(dayCount, timeStrin) {
  const [hours, minutes] = timeStrin.split(':').map(Number);
  return (minutesInADay * dayCount) + (hours * 60) + minutes;
}

async function search() {
  return new Promise((resolve, reject) => {
    request.get(getOptions(), (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

async function openNow() {
  time = getMinutesOffset(1, '19:00');
  const res = await search();
  // const resultsSummary = JSON.parse(res).response.resultPacket.resultsSummary;
  const results = JSON.parse(res).response.resultPacket.results;
  console.log(results.map(r => r.summary));
}

openNow();
