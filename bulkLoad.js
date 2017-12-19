const jsontoxml = require('jsontoxml');
const transform = require('./lib/transform');
const rawdata = require('./pharmacy-data');

console.log(rawdata.length);
const data = transform(rawdata.slice(0, 3));

const xmls = data.map(pharmacy => jsontoxml({ pharmacy }));
const xml = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>${xmls.join('')}`;
console.log(xml);
