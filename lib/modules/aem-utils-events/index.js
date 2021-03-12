const getCountry = require('../../utils/get-country');
const log = require('../../utils/log');


module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemEvents',
  label: 'AEM Events Utils',
  construct,
};


function construct(self, options) {
  self.addHelpers({
    getLocation,
  });

  function getLocation(piece, options) {
    // ensure piece
    if (!piece) {
      log.warning('Unable to get location, no event piece found.');
      return;
    }

    const { city, country, isOnlyOnline } = piece;
    const { i18n, locale } = options;

    if (isOnlyOnline) {
      return i18n('events|locationOnlyOnline');
    } else {
      const localizedCountry = getCountry(country, locale);
      return `${city}, ${localizedCountry}`;
    }
  }
}
