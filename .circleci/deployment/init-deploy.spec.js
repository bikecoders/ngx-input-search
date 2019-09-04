const initDeployModule = require('./init-deploy');
const {
  checkProjectsToDeploy,
  deployApps,
  getTargetsToScan,
  initDeploy,
} = initDeployModule;

jest.mock('./utils/exec-async');
const execMock = require('./utils/exec-async');

jest.mock('./apps');
const deployers = require('./apps');

describe('Deploy Index', () => {
  beforeEach(() => {
    spyOn(console, 'log').and.callFake(message => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTargetsToScan', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
      jest.resetModules(); // this is important - it clears the cache
      process.env = { ...OLD_ENV };
      delete process.env.NODE_ENV;
    });

    afterEach(() => {
      process.env = OLD_ENV;
    });

    it('should return all targets if the flag "deploy all" is set', async () => {
      process.env.FORCE_DEPLOY_ALL = 'true';
      const expectedTargets = ['apps --all', 'libs --all'];

      const targetsToScan = getTargetsToScan();

      expect(targetsToScan).toEqual(expectedTargets);
    });

    it('should always have --all parameter in the libs target', () => {
      const expectedTargets = ['apps', 'libs --all'];

      const targetsToScan = getTargetsToScan();

      expect(targetsToScan).toEqual(expectedTargets);
    });
  });

  describe('checkProjectsToDeploy', () => {
    it('should build the command to execute correctly', done => {
      const targets = ['tgt1', 'tgt2', 'tgt3'];
      const expectedCommand = targets
        .map(
          tar =>
            `yarn --silent affected:${tar} | tail --lines 2 | xargs | awk '{ print $2 }'`,
        )
        .join(' && ');
      jest.spyOn(initDeployModule, 'getTargetsToScan').mockReturnValue(targets);

      checkProjectsToDeploy()
        .then(() => {
          expect(execMock.exec).toHaveBeenCalledWith(expectedCommand);
          done();
        })
        .catch(err => fail('should be completed' + err));

      execMock.resolve('');
    });

    it('should return the apps to be deployed in the right format', async done => {
      const expectedApps = ['dummy', 'foo', 'bar'];

      checkProjectsToDeploy()
        .then(appsToBeDeployed => Object.keys(appsToBeDeployed))
        .then(appsToBeDeployed => {
          expect(appsToBeDeployed).toEqual(expectedApps);
          done();
        })
        .catch(() => fail('should be completed'));

      execMock.resolve('dummy\nfoo\nbar');
    });

    it('should return falsy if there is no apps to deploy', done => {
      checkProjectsToDeploy()
        .then(appsToBeDeployed => {
          expect(appsToBeDeployed).toBeFalsy();
          done();
        })
        .catch(err => fail('should be completed' + err));

      execMock.resolve('');
    });
  });

  describe('DeployApps', () => {
    const getDeployersCalls = () =>
      Object.keys(deployers)
        .map(depKey => deployers[depKey])
        .map(dep => dep.mock.calls.length)
        .reduce((acc, depCalls) => ((acc += depCalls), acc), 0);

    it("should don't call any APP deployer", done => {
      deployApps(null)
        .then(() => {
          nDeployersCalls = getDeployersCalls();
          expect(nDeployersCalls).toEqual(0);

          done();
        })
        .catch(err => fail('should be completed' + err));
    });

    it('should raise the error told by the deployers', done => {
      const deployersFound = {
        deployer1: {},
      };

      const customError = 'customError :)';

      deployers.deployer1.mockImplementationOnce(async () => {
        throw customError;
      });

      deployApps(deployersFound)
        .then(() => {
          fail('should throw an error');
        })
        .catch(err => {
          expect(err).toEqual(customError);
          done();
        });
    });

    describe("Deployers' call", () => {
      let deployersFound;
      let nDeployersFound;

      beforeEach(() => {
        deployersFound = {
          deployer1: {},
          deployer2: {},
        };

        nDeployersFound = Object.keys(deployersFound).length;
      });

      it('should call all told deployers', done => {
        deployApps(deployersFound)
          .then(() => {
            nDeployersCalls = getDeployersCalls();

            expect(nDeployersCalls).toEqual(nDeployersFound);
            done();
          })
          .catch(err => fail('should be completed' + err));
      });

      it('should not call the deployers that are not found', done => {
        deployApps(deployersFound)
          .then(() => {
            expect(deployers.deployer3).not.toHaveBeenCalled();
            done();
          })
          .catch(err => fail('should be completed' + err));
      });
    });
  });
});
