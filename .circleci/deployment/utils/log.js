module.exports = function (prefix = '') {

  return function(message = '') {
    console.log(`${prefix} --- ${message}`);
  };
};
