const log = require('../../utils/log');

const countries = {
  en: require('../../constants/countries/en.json'),
  fr: require('../../constants/countries/fr.json'),
};
const languages = {
  en: require('../../constants/languages/en.json'),
  fr: require('../../constants/languages/fr.json'),
};
const vowels = require('../../constants/vowels.json');


module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemI18n',
  label: 'AEM Localization Utils',
  construct,
};


function construct(self, options) {
  // add helpers
  self.addHelpers({
    getCountry,
    getLanguage,
    getLanguagesFrom,
    getSanitizedLocale,
    isFirstCharVowel,
    isSameLocale,
    replace,
  });

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
        'isFirstCharVowel() expected a string, but none was provided. Will return false.'
      );
      return false;
    }

    const firstChar = str.charAt(0);
    return vowels.includes(firstChar);
  }

  /**
   * @param {string} localeA Locale string to compare
   * @param {string} localeB Locale string to compare
   * @param {object} options Options for comparison
   * - {boolean} emptyAsTrue Whether to return true if one of the locale is an empty string. Set to `false` by default.
   */
  function isSameLocale(localeA, localeB, options) {
    if (
      localeA === undefined
      || localeA === null
      || typeof localeA !== 'string'
      || localeB === undefined
      || localeB === null
      || typeof localeB !== 'string'
    ) {
      log.warning(
        'isSameLocale() expected two locale strings, but one or none was provided. Will return false.'
      );
      return false;
    }

    const isExactMatch = localeA.toLowerCase() === localeB.toLowerCase();

    if (options && options.emptyAsTrue) {
      if (localeA === '' || localeB === '') {
        return true;
      } else {
        return isExactMatch;
      }
    } else {
      return isExactMatch;
    }
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
      throw new Error('Method expects a string as the first parameter.');
    }
    if (!options || !Array.isArray(options)) {
      throw new Error('Method expects an options array as second parameter.');
    }
    let response = str;
    options.forEach(option => {
      response = response.replace(option.pattern, option.str);
    });
    return response;
  }
}
