const log = require('./log');


module.exports = getCountry;


const countries = {
  en: require('../constants/countries/en.json'),
  fr: require('../constants/countries/fr.json'),
};

function getCountry(countryCode, locale) {
  // error checks
  if (!countryCode) {
    throw new Error('getCountry() expected `countryCode`, a two-letter country code, as first parameter.');
  }
  const errorMessage = 'getCountry() expected `locale`, a two-letter language code, as second parameter. ';
  if (!locale) {
    log.warning(errorMessage);
    return countryCode.toUpperCase();
  }
  if (typeof locale !== 'string') {
    log.warning(
      errorMessage
      + `The type provided was "${ typeof locale }"`
    );
    return countryCode.toUpperCase();
  }

  const sanitizedLang = locale.substr(0, 2);

  try {
    // provide localized country
    return countries[sanitizedLang.toLowerCase()][countryCode.toUpperCase()];
  } catch (error) {
    log.critical(
      'getCountry() was unable to localize the country code.'
    );
    return countryCode;
  }
}
