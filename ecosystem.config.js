// Originally created by Antoine Beauvais-Lacasse

const projectName = require('./package.json').name;

const deployPath = `/srv/${ projectName }`;

const installDependenciesCommand = 'NODE_ENV=production yarn --prod';
const bundleCommand = 'APOS_BUNDLE=1 node app apostrophe:generation --create-bundle prod-bundle';
const launchAppCommand = 'pm2 startOrRestart ecosystem.config.js --env prod';

const stagingDeployCommand = [installDependenciesCommand, launchAppCommand].join(' && ');
const prodDeployCommand = [installDependenciesCommand, bundleCommand, launchAppCommand].join(' && ');

module.exports = {
  deployPath,
  apps: [
    {
      name: projectName,
      script: 'app.js',
      env: {
        NODE_ENV: 'production',
        CONFIG_FILE: `${ deployPath }/.env`,
        HOST: 'localhost',
        PORT: '9696'
      }
    }
  ],
  deploy: {
    staging: {
      user: 'jansensan',
      host: 'demo.raker.cloud',
      ref: 'origin/master',
      repo: `/jansensan/${ projectName }.git`,
      path: deployPath,
      'post-deploy': stagingDeployCommand,
      env: {}
    },
    production: {
      user: 'jansensan',
      host: 'demo.raker.cloud',
      ref: 'origin/master',
      repo: `/jansensan/${ projectName }.git`,
      path: deployPath,
      'post-deploy': prodDeployCommand,
      env: {
        APOS_BUNDLE: 'prod-bundle'
      }
    }
  }
};
