const log = require('./log');


module.exports = getLanguage;


const languages = {
  en: require('../constants/languages/en.json'),
  fr: require('../constants/languages/fr.json'),
};

function getLanguage(languageCode, locale) {
  // error checks
  if (!languageCode) {
    throw new Error('getLanguage() expected `languageCode`, a two-letter country code, as first parameter.');
  }
  const errorMessage = 'getLanguage() expected `locale`, a two-letter language code, as second parameter. ';
  if (!locale) {
    log.warning(errorMessage);
    return languageCode.toUpperCase();
  }
  if (typeof locale !== 'string') {
    log.warning(
      errorMessage
      + `The type provided was "${ typeof locale }"`
    );
    return languageCode.toUpperCase();
  }

  // provide localized language
  return languages[locale.toLowerCase()][languageCode.toUpperCase()];
}
