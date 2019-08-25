const fs = require('fs');
const log = require('../utils/log')('📦');
const { exec } = require('../utils/exec-async');

module.exports = async function() {
  log('Deploying Package');

  await populateVersion();
  await deploy();

  async function deploy() {
    const deploymentCommand = 'ng deploy ngx-input-file';
    // Execute resolver
    const { stdout, stderr } = await exec(deploymentCommand);

    if (stderr) {
      throw stderr;
    }

    log(stdout);
  }

  async function populateVersion() {
    const mainPackageJsonPath = './package.json';
    const libPackageJsonPath = './libs/ngx-input-search/package.json';

    const mainPackageJsonStr = await readFileAsync(mainPackageJsonPath);
    const currentVersion = JSON.parse(mainPackageJsonStr).version;

    let libPackageJsonStr = await readFileAsync(libPackageJsonPath);
    const libPackageJson = JSON.parse(libPackageJsonStr);

    libPackageJson.version = currentVersion;
    libPackageJsonStr = JSON.stringify(libPackageJson);

    await writeFileAsync(libPackageJsonPath, libPackageJsonStr);

    function readFileAsync(path) {
      return new Promise((res, rej) => {
        fs.readFile(path, 'utf8', function(err, contents) {
          if (err) rej(err);

          res(contents);
        });
      });
    }

    function writeFileAsync(path, data) {
      return new Promise((res, rej) => {
        fs.writeFile(path, data, 'utf8', function(err) {
          if (err) rej(err);

          res();
        });
      });
    }
  }
};
