module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemPieces',
  label: 'AEM Pieces Utils',
  construct: construct,
};

function construct(self, options) {
  self.addHelpers({
    getAtPage,
    getFirstTwo,
    getFirstTwoWithTags,
    getWithTags,
  });

  function getAtPage(pieces, pageNumber) {
    const resultsPerPage = 10;
    const startIndex = (pageNumber - 1) * resultsPerPage;
    const lastIndex = startIndex + resultsPerPage;
    let response = [];
    for (let i = startIndex; i < lastIndex; i++) {
      const element = pieces[i];
      if (element) {
        response.push(element);
      }
    }
    return response;
  }

  function getFirstTwo(pieces) {
    if (pieces[1]) {
      return [
        pieces[0],
        pieces[1],
      ];
    } else {
      return[pieces[0]];
    }
  }

  function getFirstTwoWithTags(pieces, tags) {
    const filtered = getWithTags(pieces, tags);
    return getFirstTwo(filtered);
  }

  function getWithTags(pieces, tags) {
    if (!pieces) {
      throw new Error('Expected an array (`pieces`), but none was provided.');
    }

    if (!tags || !tags.length) {
      return pieces;
    }

    let response = [];

    // TODO: improve for performance?
    pieces.forEach(piece => {
      piece.tags.forEach(tag => {
        if (tags.includes(tag)) {

          // add only if not present
          let isAlreadyAdded = false;
          response.forEach(r => {
            if (r._id === piece._id) {
              isAlreadyAdded = true;
            }
          });

          if (!isAlreadyAdded) {
            response.push(piece);
          }
        }
      })
    });

    return response;
  }
}
