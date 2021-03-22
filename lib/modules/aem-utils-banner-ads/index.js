const moment = require('moment');

const getWorkflowMode = require('../../utils/get-workflow-mode');
const log = require('../../utils/log');

const BannerTypes = require('../../constants/banner-types');


module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemBannerAds',
  label: 'AEM Banner Ads Utils',
  construct,
};


function construct(self, options) {
  self.addHelpers({
    areVisible,
    determineHelpVisibility,
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
  function determineHelpVisibility(options) {
    if (!options) {
      log.warning(
        'determineHelpVisibility() expected an `options` object, but none was provided. '
      );
      return true;
    }

    if (getNumActive(options)) {
      const activeBannerTypes = [];

      const items = getItems(options);
      items.forEach(item => {
        // pick "piece" from apos data structure
        // TODO: check for more potential errors?
        const banner = item._pieces[0];

        if (isActive(banner)) {
          activeBannerTypes.push(banner.bannerType);
        }
      });

      if (activeBannerTypes.includes(BannerTypes.HALF_PAGE) || activeBannerTypes.length > 1) {
        return false;
      }

      return true;
    }

    return true;
  }

  /**
   * @param {object} options
   * - data
   * - propName
    */
  function getItems(options) {
    const { data, propName } = options;
    const piece = data.global[propName];

    const warningPrefix = 'Error at getItems():';
    const defaultAction = 'An empty array will be returned.';

    if (!piece) {
      log.warning(
        `${ warningPrefix } No piece found with property name "${ propName }". ${ defaultAction }`
      );
      return [];
    }

    const { items } = piece;

    if (!items) {
      log.warning(
        `${ warningPrefix } no property "items" found on piece with property name "${ propName }". `
          + defaultAction
      );
      return [];
    }

    return items;
  }

  /**
   * @param {object} options
   * - data
   * - propName
    */
  function getNumActive(options) {
    let response = 0;

    const items = getItems(options);

    items.forEach(item => {
      // pick "piece" from apos data structure
      // TODO: check for more potential errors?
      const banner = item._pieces[0];
      if (isActive(banner)) {
        response++;
      }
    });

    return response;
  }

  function isActive(banner) {
    if (!banner) {
      log.warning(
        'isActive() expected a `banner` object, but none was provided. '
      );
      return false;
    }

    return moment().isBetween(moment(banner.startDate), moment(banner.endDate));
  }
}
