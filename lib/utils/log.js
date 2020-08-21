const chalk = require('chalk');
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
  log(logInfo('Info:'), message);
}

function warning(message) {
  log(logWarning('WARNING:'), message);
}

function critical(message) {
  log(logCritical('CRITICAL:'), message);
}
