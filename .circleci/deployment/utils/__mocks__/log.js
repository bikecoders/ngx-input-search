let logFnMock = jest.fn();

module.exports = function(prefix = '') {
  return logFnMock;
};
