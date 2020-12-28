const moment = require('moment');

const log = require('../../utils/log');


module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemBannerAds',
  label: 'AEM Banner Ads Utils',
  construct,
};


function construct(self, options) {
  self.addHelpers({
    areVisible,
    getNumActive,
  });


  /**
   * @param {object} options
   * - data
   * - propName
    */
  function areVisible(options) {
    // TODO: improve?
    const { data } = options;
    const { user } = data;
    let isUserAdmin = false;
    if (user) {
      user._groups.forEach(group => {
        if (group.title === 'admin') {
          isUserAdmin = true;
        }
      });
    }

    if (isUserAdmin) {
      return true;
    } else {
      const numActiveBannerAds = getNumActive(options);
      return (numActiveBannerAds > 0);
    }
  }

  /**
   * @param {object} options
   * - data
   * - propName
    */
  function getNumActive(options) {
    const { data, propName } = options;
    let response = 0;

    const piece = data.global[propName];

    // error checks
    const warningPrefix = 'Unable to get number of active banner ads, ';
    if (!piece) {
      log.warning(
        warningPrefix
        + `no piece found with property name "${ propName }".`
      );
      return response;
    }

    const { items } = piece;

    if (!piece) {
      log.warning(
        warningPrefix
        + `no property "items" found on piece with property name "${ propName }".`
      );
      return response;
    }

    // TODO: check for more potential errors?

    items.forEach(item => {
      const banner = item._pieces[0];
      if (moment().isBetween(moment(banner.startDate), moment(banner.endDate))) {
        response++;
      }
    });
    return response;
  }
}
