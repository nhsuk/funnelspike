const convert = require('xml-js');
const transform = require('./lib/transform');
const rawdata = require('./pharmacy-data');

const data = transform(rawdata.slice(0, 3));
const xml = convert.js2xml({ pharmacy: data[0] }, { compact: true });
console.log(data[0]);
console.log(xml);
