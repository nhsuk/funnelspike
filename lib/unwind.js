let count;

function updateProps(curr, prop, propVal) {
  const obj = Object.assign({}, curr, { [prop]: propVal });
  obj.url = `${obj.url}${count}%2F`;
  if (count === 0) {
    obj.isMaster = true;
  }
  count += 1;
  return obj;
}

function expandProperty(acc, curr, prop) {
  count = 0;
  if (curr[prop] && curr[prop].length > 0) {
    const props = curr[prop].map(propVal => updateProps(curr, prop, propVal));
    return [...acc, ...props];
  }
  // eslint-disable-next-line
  curr[prop] = undefined;
  // eslint-disable-next-line
  curr.url = `${curr.url}${count}%2F`;
  // eslint-disable-next-line
  curr.isMaster = true;
  return [...acc, curr];
}
function unwind(array, prop) {
  return array.reduce((acc, curr) => expandProperty(acc, curr, prop), []);
}

module.exports = unwind;
