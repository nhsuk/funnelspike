const request = require('request');
const xml2js = require('xml2js');
const decode = require('./encoder').decode;

const collection = process.env.FUN_COLLECTION || 'mark-test-xml';
const minutesInADay = 1440;

const urlStart = `https://nhs-dev-search01.squiz.co.uk/s/search.json?collection=${collection}&MBL=100000&query=altDate:`;

function getOptions(time, coordinates) {
  const timeRange = `&ge_closes=${time}&le_opens=${time}`;
  const geoRange = `&maxdist=32.19&origin=${coordinates.latitude},${coordinates.longitude}&sort=prox`;
  const url = `${urlStart}weekly${timeRange}${geoRange}`;
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

function getAltOptions(time, coordinates) {
  const geoRange = `&maxdist=32.19&origin=${coordinates.latitude},${coordinates.longitude}&sort=prox`;
  const url = urlStart + time + geoRange;
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

async function search(options) {
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

function dayOfWeekFromMonday(moment) {
  const dayOfWeek = moment.day() - 1;
  return dayOfWeek > -1 ? dayOfWeek : 6;
}

function timeToMinutesSinceMidnightMonday(moment) {
  return (dayOfWeekFromMonday(moment) * minutesInADay) + (moment.hours() * 60) + moment.minutes();
}

function mapResult(record) {
  const metadata = record.metaData;
  let openingTimes;
  if (metadata.openingTimes) {
    openingTimes = JSON.parse(decode(metadata.openingTimes));
  }
  return {
    identifier: metadata.identifier,
    name: metadata.name,
    address: {
      line1: metadata.addressLine1,
      line2: metadata.addressLine2,
      line3: metadata.addressLine3,
      city: metadata.addressCity,
      county: metadata.addressCounty,
      postCode: metadata.addressPostcode,
      telephoneNumber: metadata.telephoneNumber,
      distanceInMiles: record.kmFromOrigin * 0.621
    },
    openingTimes,
  };
}

async function getAlterations(moment, coordinates) {
  const day = moment.format('YYYY-MM-DD');
  const res = await search(getAltOptions(day, coordinates));
  const results = JSON.parse(res).response.resultPacket.results;
  return results.map(mapResult);
}

async function getOpenNow(moment, coordinates) {
  const time = timeToMinutesSinceMidnightMonday(moment);
  const res = await search(getOptions(time, coordinates));
  const results = JSON.parse(res).response.resultPacket.results;
  return results.map(mapResult);
}

module.exports = {
  getOpenNow,
  getAlterations,
};
