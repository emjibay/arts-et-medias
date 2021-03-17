const moment = require('moment');

const getWorkflowMode = require('../../utils/get-workflow-mode');
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
    if (!options) {
      log.warning(
        'areVisible() expected an `options` object, but none was provided. '
      );
      return true;
    }

    // TODO: improve? (#87)
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

    const hasActiveBannerAds = getNumActive(options) > 0;
    const mode = getWorkflowMode(data);

    if (isUserAdmin) {
      if (
        (mode === 'live' || mode === 'preview')
        && !hasActiveBannerAds
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      return hasActiveBannerAds;
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
