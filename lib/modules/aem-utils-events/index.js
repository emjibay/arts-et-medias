const getCountry = require('../../utils/get-country');
const getPiecesWithTags = require('../../utils/get-pieces-with-tags');
const log = require('../../utils/log');


module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemEvents',
  label: 'AEM Events Utils',
  construct,
};


function construct(self, options) {
  self.addHelpers({
    filterNextEventBlocks,
    filterOngoingAndFuture,
    filterRecentlyAdded,
    getLocation,
  });

  function filterNextEventBlocks(blocks, numPreviews) {
    // TODO: error checks
    const response = [];

    blocks.forEach(block => {
      if (block.pieces.length >= numPreviews) {
        response.push(block);
      }
    });

    return response;
  }

  function filterOngoingAndFuture(data, tags) {
    if (!data) {
      log.warning(
        'Error at filterOngoingAndFuture(): '
          + 'Method expects ApostropheCMS `data` as the first parameter. '
          + 'An empty array will be returned.'
      );
      return;
    }

    // TODO: error checks
    return getPiecesWithTags(data.ongoingAndFutureEvents, tags);
  }

  function filterRecentlyAdded(data, tags) {
    if (!data) {
      log.warning(
        'Error at filterRecentlyAdded(): '
          + 'Method expects ApostropheCMS `data` as the first parameter. '
          + 'An empty array will be returned.'
      );
      return;
    }

    // TODO: error checks
    return getPiecesWithTags(data.eventsByMostRecent, tags);
  }

  function getLocation(piece, options) {
    // ensure piece
    if (!piece) {
      log.warning(
        'Error at getLocation(): '
          + 'Method expects an event `piece` as first parameter, but none was provided. '
      );
      return;
    }

    const { city, country, isOnlyOnline } = piece;
    const { i18n, locale } = options;

    if (isOnlyOnline) {
      return i18n('events|locationOnlyOnline');
    } else {
      const localizedCountry = getCountry(country, locale);
      return `${ city }, ${ localizedCountry }`;
    }
  }
}
