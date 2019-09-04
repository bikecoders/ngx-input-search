const log = require('../utils/log')('🌐');

const { exec } = require('../utils/exec-async');

module.exports = async function() {
  log('Deploying DEMO');

  const deploymentCommand =
    'ng deploy demo --repo=https://$GITHUB_TOKEN@github.com/bikecoders/ngx-input-search.git --dry-run';

  const { stdout } = await exec(deploymentCommand);

  log(stdout);
};
