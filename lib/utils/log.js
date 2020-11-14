const chalk = require('chalk');
const log = console.log;

const logCritical = chalk.red.bold;
const logInfo = chalk.blue.bold;
const logWarning = chalk.yellow.bold;

const isProduction = process.env.NODE_ENV === 'production';


module.exports = {
  critical,
  info,
  warning,
};


function info(message) {
  if (isProduction) {
    return;
  }

  log(logInfo('Info:'), message);
}

function warning(message) {
  if (isProduction) {
    return;
  }

  log(logWarning('WARNING:'), message);
}

function critical(message) {
  log(logCritical('CRITICAL:'), message);
}
