// Originally created by Antoine Beauvais-Lacasse

const projectName = require('./package.json').name;

const deployPath = `/srv/${projectName}`;

const installDependenciesCommand = 'NODE_ENV=production yarn --prod';
const bundleCommand = 'APOS_BUNDLE=1 node app apostrophe:generation --create-bundle prod-bundle';
const launchAppCommand = 'pm2 startOrRestart ecosystem.config.js --env prod';

const prodDeployCommand = [installDependenciesCommand, bundleCommand, launchAppCommand].join(' && ');

module.exports = {
  deployPath,
  apps: [
    {
      name: projectName,
      script: 'app.js',
      env: {
        NODE_ENV: 'production',
        CONFIG_FILE: `${deployPath}/.env`,
        HOST: '127.0.0.1',
        PORT: '9696'
      }
    }
  ],
  deploy: {
    production: {
      user: 'jansensan',
      host: 'arts-et-medias.net',
      ref: 'origin/master',
      repo: `/jansensan/${projectName}.git`,
      path: deployPath,
      'post-deploy': prodDeployCommand,
      env: {
        APOS_BUNDLE: 'prod-bundle'
      }
    }
  }
};
