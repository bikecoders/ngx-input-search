const fs = require('fs');

jest.mock('../utils/exec-async');
const execMock = require('../utils/exec-async');

jest.mock('../utils/log');

const ngxInputSearchDeployer = require('./ngx-input-search');

describe('Ngx Input Search Deployer', () => {
  const callbackFsSpy = (err, data) => {
    return (...params) => {
      params[params.length - 1](err, data);
    };
  };

  let mainPackageJsonData;
  let libPackageJsonData;

  beforeEach(() => {
    mainPackageJsonData = '{ "version": "1.0.0", "moreData": true }';
    libPackageJsonData = '{ "version": "placeHolder", "anyOtherData": true }';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Without errors', () => {
    let expectedLibPackageJsonData;
    let writeFileSpy;

    beforeEach(() => {
      expectedLibPackageJsonData = (function() {
        const mainVersion = JSON.parse(mainPackageJsonData).version;

        const expected = JSON.parse(libPackageJsonData);
        expected.version = mainVersion;

        return JSON.stringify(expected);
      })();

      jest
        .spyOn(fs, 'readFile')
        .mockImplementationOnce(callbackFsSpy(null, mainPackageJsonData))
        .mockImplementationOnce(callbackFsSpy(null, libPackageJsonData));

      writeFileSpy = jest
        .spyOn(fs, 'writeFile')
        .mockImplementation(callbackFsSpy(null));

      execMock.exec.mockImplementation(async () => ({
        stdout: 'custom stdout',
      }));
    });

    it('should change the placeholder version for the main version present the package.json', async done => {
      ngxInputSearchDeployer()
        .then(() => {
          expect(writeFileSpy).toHaveBeenCalledWith(
            expect.any(String),
            expectedLibPackageJsonData,
            expect.any(String),
            expect.any(Function),
          );
          done();
        })
        .catch(() => fail('should be completed'));
    });

    it('should call the package deployer', done => {
      ngxInputSearchDeployer()
        .then(() => {
          const deployCommandExecuted = execMock.exec.mock.calls[0][0];
          expect(deployCommandExecuted).toEqual('ng deploy ngx-input-file');
          done();
        })
        .catch(() => fail('should be completed'));
    });
  });

  describe('Errors', () => {
    let customError;

    beforeEach(() => {
      customError = { someError: true };
    });

    it('should indicate that an error occurs trying to Read a File', done => {
      jest
        .spyOn(fs, 'readFile')
        .mockImplementationOnce(callbackFsSpy(customError));

      ngxInputSearchDeployer()
        .then(() => {
          fail('should not be completed');
        })
        .catch(err => {
          expect(err).toEqual(customError);
          done();
        });
    });

    it('should indicate that an error occurs trying to Write a File', done => {
      jest
        .spyOn(fs, 'readFile')
        .mockImplementationOnce(callbackFsSpy(null, mainPackageJsonData))
        .mockImplementationOnce(callbackFsSpy(null, libPackageJsonData));

      jest
        .spyOn(fs, 'writeFile')
        .mockImplementationOnce(callbackFsSpy(customError));

      ngxInputSearchDeployer()
        .then(() => {
          fail('should not be completed');
        })
        .catch(err => {
          expect(err).toEqual(customError);
          done();
        });
    });

    it('should indicate that an error occurs trying to execute the deployer', done => {
      jest
        .spyOn(fs, 'readFile')
        .mockImplementationOnce(callbackFsSpy(null, mainPackageJsonData))
        .mockImplementationOnce(callbackFsSpy(null, libPackageJsonData));

      jest.spyOn(fs, 'writeFile').mockImplementationOnce(callbackFsSpy(null));

      execMock.exec.mockImplementation(async () => {
        return {
          stderr: customError,
        };
      });

      ngxInputSearchDeployer()
        .then(() => {
          fail('should not be completed');
        })
        .catch(err => {
          expect(err).toEqual(customError);
          done();
        });
    });
  });
});
