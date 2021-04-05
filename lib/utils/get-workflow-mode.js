const log = require('./log');


module.exports = getWorkflowMode;


/**
 * @param {Object} data ApostropheCMS data object
 * @returns {String} The value of ApostropheCMS' workflow mode; either "draft", "preview", or "live"
 */
function getWorkflowMode(data) {
  if (!data) {
    log.warning(
      'Error at getWorkflowMode(): '
        + 'Method expected `data` as a parameter, but none was provided. '
        + '"live" will be the returned value. '
    );
    return 'live';
  }


  const workflowPreview = data.workflowPreview;
  const aposBodyClasses = data.aposBodyClasses;

  if (workflowPreview) {
    return 'preview';
  } else {
    if (aposBodyClasses && aposBodyClasses.indexOf('draft') > -1) {
      return 'draft';
    } else {
      return 'live';
    }
  }
}
