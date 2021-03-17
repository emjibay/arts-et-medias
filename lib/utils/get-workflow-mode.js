module.exports = getWorkflowMode;


/**
 * @param {Object} data ApostropheCMS data object
 * @returns {String} The value of ApostropheCMS' workflow mode; either "draft", "preview", or "live"
 */
function getWorkflowMode(data) {
  const { aposBodyClasses, workflowPreview } = data;

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
