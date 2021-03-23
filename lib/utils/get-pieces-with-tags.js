const arrayUtils = require('./array');
const log = require('./log');


module.exports = getPiecesWithTags;


function getPiecesWithTags(pieces, tags) {
  // error checks
  if (!pieces) {
    log.warning(
      'getPiecesWithTags() expects `pieces`, an array of ApostropheCMS pieces, as first parameter. '
      + 'None was provided, an empty array will be returned.'
    );
    return [];
  }

  if (!tags || (tags && !tags.length)) {
    return pieces;
  }

  let response = [];

  pieces.forEach(piece => {
    if (arrayUtils.intersect(piece.tags, tags)) {
      response = arrayUtils.pushUnique(response, piece);
    }
  });

  return response;
}
