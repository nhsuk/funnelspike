const jsontoxml = require('jsontoxml');
const transform = require('./lib/transform');
const data = transform(require('./pharmacy-data'));

console.log(jsontoxml(data[0]));
