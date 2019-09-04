const demoDeployFn = require('./demo');

jest.mock('../utils/exec-async');
const execMock = require('../utils/exec-async');

jest.mock('../utils/log');
const log = require('../utils/log')();

describe('Demo Deploy', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should execute demo deployment', done => {
    demoDeployFn().then(() => {
      const expectedDeployCommandRegex = /ng deploy demo.*/;

      const deployCommandExecuted = execMock.exec.mock.calls[0][0];
      expect(
        expectedDeployCommandRegex.test(deployCommandExecuted),
      ).toBeTruthy();
      done();
    });

    execMock.resolve('custom stdout');
  });

  it('should log the stdout', done => {
    let customStdOut = 'custom stdout';

    demoDeployFn()
      .then(() => {
        expect(log).toHaveBeenLastCalledWith(customStdOut);
        done();
      })
      .catch(stderr => fail('The promise should be complete'));

    execMock.resolve(customStdOut);
  });

  it('should end the script with error', done => {
    let customStdErr = 'custom stderr';

    demoDeployFn()
      .then(() => fail('The promise should not be complete'))
      .catch(stderr => {
        expect(stderr).toEqual(customStdErr);
        done();
      });

    execMock.reject(customStdErr);
  });
});
