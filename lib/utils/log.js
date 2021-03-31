const chalk = require('chalk');
const isProd = require('./is-prod');
const log = console.log;

const logCritical = chalk.red.bold;
const logInfo = chalk.blue.bold;
const logWarning = chalk.yellow.bold;


module.exports = {
  critical,
  info,
  warning,
};


function info(message) {
  if (isProd()) {
    return;
  }

  log(logInfo('Info:'), message);
}

function warning(message) {
  if (isProd()) {
    return;
  }

  log(logWarning('WARNING:'), message);
}

function critical(message) {
  log(logCritical('CRITICAL:'), message);
}
