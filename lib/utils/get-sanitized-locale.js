module.exports = getSanitizedLocale;


function getSanitizedLocale(data) {
  // error checks
  if (!data) {
    throw new Error('getSanitizedLocale() expects `data`, the ApostropheCMS data object.');
  }

  const locale = data.locale || data.workflow.locale;
  return locale.substr(0, 2);
}
