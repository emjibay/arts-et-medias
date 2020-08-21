const log = require('../../utils/log');

const countries = {
  en: require('../../constants/countries/en.json'),
  fr: require('../../constants/countries/fr.json'),
}
const languages = {
  en: require('../../constants/languages/en.json'),
  fr: require('../../constants/languages/fr.json'),
}
const vowels = require('../../constants/vowels.json');


module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemI18n',
  label: 'AEM Localization Utils',
  construct: constructHelpers
};


function constructHelpers(self, options) {
  // add helpers
  self.addHelpers({
    getCountry,
    getLanguage,
    getLanguagesFrom,
    getSanitizedLocale,
    isFirstCharVowel,
    replace,
  });

  function getCountry(countryCode, locale) {
    if (!countryCode) {
      throw new Error('getCountry() expects `countryCode`, a two-letter country code, as first parameter.');
    }
    if (!locale) {
      log.warning(
        'getCountry() expects `locale`, a two-letter language code, as second parameter.'
      );
      return countryCode.toUpperCase();
    }

    return countries[locale.toLowerCase()][countryCode.toUpperCase()];
  }

  function getLanguage(languageCode, locale) {
    if (!languageCode) {
      throw new Error('getLanguage() expects `languageCode`, a two-letter country code, as first parameter.');
    }
    if (!locale) {
      log.warning(
        'getLanguage() expects `locale`, a two-letter language code, as second parameter.'
      );
      return languageCode.toUpperCase();
    }

    return languages[locale.toLowerCase()][languageCode.toUpperCase()];
  }

  function getLanguagesFrom(source, locale) {
    if (!source) {
      throw new Error('getLanguagesFrom() expects `source`, a comma-separated list in a string, as first parameter.');
    }
    if (!locale) {
      throw new Error('getLanguagesFrom() expects `locale`, a two-letter language code, as second parameter.');
    }

    // sanitize
    const space = new RegExp(' ', 'g');
    source = source.replace(space, '').toUpperCase();

    const codes = source.split(',');

    let response = [];
    codes.forEach(code => {
      const lang = getLanguage(code, locale);
      if (lang) {
        response.push(lang);
      }
    });

    return response;
  }

  function getSanitizedLocale(data) {
    if (!data || !data.locale) {
      throw new Error('getSanitizedLocale() expects `data`, the ApostropheCMS data object.');
    }

    return data.locale.replace('-draft', '');
  }

  function isFirstCharVowel(str) {
    if (!str) {
      log.warning(
        'isFirstCharVowel() expects a string, but none was provided.'
      );
      return false;
    }

    const firstChar = str.charAt(0);
    return vowels.includes(firstChar);
  }

  /**
   * @param {string} str String in which to do the replacement.
   * @param {array} options Options for replacement.
   * Array of these objects:
   * {
   *   pattern {string}
   *   str {string}
   * }
   */
  function replace(str, options) {
    if (!str || typeof str !== 'string') {
      throw new Error('Method expects a string as the first parameter.')
    }
    if (!options || !Array.isArray(options)) {
      throw new Error('Method expects an options array as second parameter.')
    }
    let response = str;
    options.forEach(option => {
      response = response.replace(option.pattern, option.str)
    });
    return response;
  }
}
