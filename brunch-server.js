const apostrophe = require('apostrophe');
const aposConfig = require('./apos-config');

/**
 * Brunch custom server function
 * See https://brunch.io/docs/config#server for details
 *
 * @param brunchConfig - Brunch config
 * @param readyCallback - Callback to tell Brunch that server is up
 * @returns {*} - Express object to close on exit
 */
const initializeApos = (brunchConfig, readyCallback) => {
  // Register the `ready` callback on apostrophe
  aposConfig.afterListen = readyCallback;

  // Raw argv -- since we are running with Brunch, avoid passing them as-is.
  // Otherwise, it thinks we want to run a task.
  // (See apostrophe's entry-point: apostrophe/index.js)
  const argv = require('yargs').argv;
  aposConfig.argv = Object.assign(argv, { _: [] });

  // Start apostrophe with tweaked config:
  const aposRoot = apostrophe(aposConfig);

  // Attach the root apos object to the function expression,
  // so that our brunch hooks can get a reference to it if needed.
  initializeApos.aposRoot = aposRoot;

  // Return the express object as required by brunch:
  return aposRoot.app;
};

module.exports = initializeApos;
