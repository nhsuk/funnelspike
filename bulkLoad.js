const unwind = require('./lib/unwind');
const transform = require('./lib/transform');
const rawdata = require('./pharmacy-data');
console.log(rawdata.length);
const data = transform(rawdata.slice(0, 3));

// const xmls = data.map(pharmacy => jsontoxml({ pharmacy }));
// const xml = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>${xmls.join('')}`;
// console.log(xml);

// const data = transform(rawdata);
const uwData = unwind(data, 'openingTimesAsOffset');
console.log(data.length);
console.log(uwData.length);
// // const max = counts.reduce((a, b) => {
// //   return Math.max(a, b);
// // });

// function sortNumber(a, b) {
//   return (a - b) * -1;
// }
// const sorted = counts.sort(sortNumber);
// console.log(sorted[0]);
//console.log(max);


