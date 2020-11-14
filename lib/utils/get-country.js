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

  // provide localized country
  return countries[locale.toLowerCase()][countryCode.toUpperCase()];
}
