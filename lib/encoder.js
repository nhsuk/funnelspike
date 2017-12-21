function decode(content) {
  return Buffer.from(content, 'base64').toString('ascii');
}

function encode(content) {
  return Buffer.from(content).toString('base64');
}

module.exports = {
  encode,
  decode
};
