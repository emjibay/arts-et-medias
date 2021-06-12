// Originally created by Antoine Beauvais-Lacasse

const projectName = require('./package.json').name;

const deployPath = `/srv/${ projectName }`;

module.exports = {
  deployPath,
  apps: [
    {
      name: projectName,
      script: 'app.js',
      env: {
        NODE_ENV: 'production',
        CONFIG_FILE: `${ deployPath }/.env`,
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
      repo: `/emjibay/${ projectName }.git`,
      path: deployPath,
      'post-deploy': 'NODE_ENV=production yarn --prod && pm2 reload ecosystem.config.js --env prod;',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};
