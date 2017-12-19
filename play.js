function expandProperty(acc, curr, prop) {
  if (curr[prop] && curr[prop].length > 0) {
    const props = curr[prop].map(propVal => Object.assign({}, curr, { [prop]: propVal }));
    return [...acc, ...props];
  }
  // eslint-disable-next-line
  delete curr[prop];
  return [...acc, curr];
}
function unwind(array, prop) {
  return array.reduce((acc, curr) => expandProperty(acc, curr, prop), []);
}

module.exports = unwind;

// const recs = [
//   { name: 'one', a: ['a', 'b', 'c'] },
//   { name: 'two', a: [] },
//   { name: 'three', a: ['c', 'd', 'e'] }
// ];

// console.log(unwind(recs, 'a'));
