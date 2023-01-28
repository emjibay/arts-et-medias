const moment = require('moment');

const BannerTypes = require('../../constants/banner-types');

const getWorkflowMode = require('../../utils/get-workflow-mode');
const hasBanners = require('../../utils/has-banners');
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
    getPiecesFrom,
    hasBanners,
    increaseAlternatingLeaderboardIndex,
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

  function getPiecesFrom(parent) {
    const response = [];

    // error checks
    const warningPrefix = 'Error at getPiecesFrom(): ';
    if (!parent) {
      log.warning(
        warningPrefix
          + 'Method expected `parent`, an ApostropheCMS object.'
      );
      return response;
    }
    const { items } = parent;
    if (!items) {
      log.warning(
        warningPrefix
          + 'Method expected `parent` to have the `items` array property.'
      );
      return response;
    }

    items.forEach(item => {
      const { _pieces } = item;
      response.push(..._pieces);
    });

    return response;
  }

  /**
   * Nunjucks sucks, as it doesn't allow to update an object property. This util allows to do this.
   *
   * @param {*} options The base from which the output is generated.
   * - index: Current index of the iteration.
   * - isMainVisible: Whether or not the main leaderboard is visible.
   * - isMinorVisible: Whether or not the minor leaderboard is visible.
   * - mainOptions
   * - minorOptions
   * - additionalOptions
   */
  function increaseAlternatingLeaderboardIndex(options) {
    // TODO: error checks
    return Object.assign(options, { index: options.index + 1 });
  }
}


// utils

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

function isActive(banner) {
  if (!banner) {
    log.warning(
      'isActive() expected a `banner` object, but none was provided. '
    );
    return false;
  }
  return moment().isBetween(moment(banner.startDate), moment(banner.endDate));
}
