const countries = require('../../constants/countries.json');
const languages = require('../../constants/languages.json');

module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemLocalization',
  label: 'AEM Localization Helpers',
  construct: constructHelpers
};

function constructHelpers(self, options) {
  const { apos } = self;

  // add helpers
  self.addHelpers({
    getCountry,
    getLanguage,
  });

  function getCountry(code) {
    return countries[code];
  }

  function getLanguage(code) {
    return languages[code];
  }
}
