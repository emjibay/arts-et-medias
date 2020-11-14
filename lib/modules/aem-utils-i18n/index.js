const log = require('../../utils/log');

const getCountry = require('../../utils/get-country');
const getLanguage = require('../../utils/get-language');


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
    isSameLocale,
    replace,
  });

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

    return data.locale.substr(0, 2);
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
