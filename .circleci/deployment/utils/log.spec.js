const logFn = require('./log');

describe('log', () => {
  let consoleLogSpy;
  let log;

  // Spies
  beforeEach(() => {
    consoleLogSpy = spyOn(console, 'log');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should print a message with the right format', () => {
    const prefix = 'prefix';

    log = logFn(prefix);
    log('some text');

    expect(consoleLogSpy).toHaveBeenCalledWith('prefix --- some text');
  });
});
