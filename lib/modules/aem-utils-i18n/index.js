const countries = require('../../constants/countries.json');
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
    replace,
  });

  function getCountry(code) {
    return countries[code.toUpperCase()];
  }

  function getLanguage(code, locale) {
    return languages[locale.toLowerCase()][code.toUpperCase()];
  }

  function getLanguagesFrom(string, locale) {
    // sanitize
    const space = new RegExp(' ', 'g');
    string = string.replace(space, '').toUpperCase();

    const codes = string.split(',');

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
    return data.locale.replace('-draft', '');
  }

  function isFirstCharVowel(str) {
    if (!str) {
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
