let execResolver;
let execRejector;

module.exports = {
  exec: jest.fn(command => {
    return new Promise((resolve, reject) => {
      execResolver = resolve;
      execRejector = reject;
    });
  }),
  resolve: function(customStdOut) {
    execResolver({
      stdout: customStdOut,
    });
  },
  reject: function(customStdErr) {
    execRejector(customStdErr);
  },
};
