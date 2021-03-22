const moment = require('moment');

const BannerTypes = require('../../constants/banner-types');
const getWorkflowMode = require('../../utils/get-workflow-mode');
const isUserInGroup = require('../../utils/is-user-in-group');
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

    const isUserAdmin = isUserInGroup(user, 'admin');
    const pieces = getPieces(options);
    const hasActiveBannerAds = getNumActive(pieces) > 0;

    if (isUserAdmin) {
      const mode = getWorkflowMode(data);
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

    const pieces = getPieces(options);
    const activeBannerTypes = [];

    if (!pieces) {
      return true;
    }

    pieces.forEach(banner => {
      if (isActive(banner)) {
        activeBannerTypes.push(banner.bannerType);
      }
    });

    if (activeBannerTypes.includes(BannerTypes.HALF_PAGE) || activeBannerTypes.length > 1) {
      return false;
    }

    return true;
  }

  /**
   * @param {object} options
   * - data
   * - propName
    */
  function getNumActive(banners) {
    if (!banners || !Array.isArray(banners)) {
      log.warning(
        'Error at getNumActive(): '
          + 'Method expected `banners`, an array of banner pieces, '
          + 'but none were provided.'
      );
      return 0;
    }

    let response = 0;

    banners.forEach(banner => {
      if (isActive(banner)) {
        response++;
      }
    });

    return response;
  }

  /**
   * @param {object} options
   * - data
   * - propName
    */
  function getPieces(options) {
    const { data, propName } = options;
    const container = data.global[propName];

    const warningPrefix = 'Error at getItems():';
    const defaultAction = 'An empty array will be returned.';

    if (!container) {
      log.warning(
        `${ warningPrefix } No piece found with property name "${ propName }". ${ defaultAction }`
      );
      return [];
    }

    const { items } = container;

    if (!items) {
      log.warning(
        `${ warningPrefix } no property "items" found on piece with property name "${ propName }". `
          + defaultAction
      );
      return [];
    }

    const response = [];
    items.forEach(item => {
      const { _pieces } = item;
      response.push(..._pieces);
    });

    return response;
  }
}


// utils
function isActive(banner) {
  if (!banner) {
    log.warning(
      'isActive() expected a `banner` object, but none was provided. '
    );
    return false;
  }
  return moment().isBetween(moment(banner.startDate), moment(banner.endDate));
}
