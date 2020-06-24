const countries = require('../../constants/countries.json');
const languages = require('../../constants/languages.json');

module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemLocalization',
  label: 'AEM Localization Helpers',
  construct: constructHelpers
};

function constructHelpers(self, options) {
  // add helpers
  self.addHelpers({
    getCountry,
    getLanguage,
    getLanguagesFrom,
  });

  function getCountry(code) {
    return countries[code];
  }

  function getLanguage(code) {
    return languages[code];
  }

  function getLanguagesFrom(string) {
    // sanitize
    const space = new RegExp(' ', 'g');
    string = string.replace(space, '').toUpperCase();

    const codes = string.split(',');
    console.log('codes:', codes);

    let response = [];
    codes.forEach(code => {
      const lang = getLanguage(code);
      if (lang) {
        response.push(lang);
      }
    });

    return response;
  }
}
