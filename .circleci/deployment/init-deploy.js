'use strict';
require('colors');
const { exec } = require('./utils/exec-async');

const appDeployers = require('./apps');

function initDeploy() {
  console.log('---------Detecting apps to Deploy 🔍---------'.bold.green);

  checkProjectsToDeploy()
    .then(apps => deployApps(apps))
    // Exists successfully
    .then(() => process.exit(0))
    // Exists with fail
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

/**
 * Read the dist folder and check what projects we need to deploy
 */
async function checkProjectsToDeploy() {
  let apps;

  const buildCommandGivenTarget = target =>
    `yarn --silent affected:${target} | tail --lines 2 | xargs | awk '{ print $2 }'`;

  const commandToExecute = module.exports
    .getTargetsToScan()
    .map(buildCommandGivenTarget)
    .join(' && ');

  const { stdout, stderr } = await exec(commandToExecute).catch(err => ({
    stdout: null,
    stderr: err,
  }));

  apps = stdout
    ? stdout
        .split('\n')
        .filter(app => !!app)
        .reduce((acc, val) => ((acc[val] = {}), acc), {})
    : null;

  return apps;
}

/**
 * Return the targets to be scanned and determine if they need to be deploy
 */
function getTargetsToScan() {
  return [`apps${process.env.FORCE_DEPLOY_ALL ? ' --all' : ''}`, 'libs --all'];
}

/**
 * @param {Array<String>} apps An array with the projects to deploy
 */
async function deployApps(apps) {
  if (!apps) {
    console.log('There is no apps to deploy 😊'.yellow.bold);
  } else {
    console.log('Apps to Deploy 🔧📦'.bold.bgGreen);
    console.log('---------------'.bgGreen.bold);
    console.log(Object.keys(apps).join(' - ').bgGreen.bold.dim);
    console.log('---------------'.bgGreen.bold);

    // Call all deployers
    const allDepProm = Object.keys(apps).map(app => appDeployers[app].call());

    await Promise.all(allDepProm);

    console.log('Deploy completed 🎉🎈💪'.bgGreen.bold);
  }
}

module.exports = {
  checkProjectsToDeploy,
  deployApps,
  initDeploy,
  getTargetsToScan,
};
