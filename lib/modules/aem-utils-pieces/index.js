const _ = require('lodash');


module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemPieces',
  label: 'AEM Pieces Utils',
  construct: construct,
};


function construct(self, options) {
  self.addHelpers({
    getAtPage,
    getAuthorList,
    getFirstN,
    getFirstTwo,
    getFirstTwoWithTags,
    getMediaWithType,
    getSanitizedType,
    getWithoutTags,
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

  function getAuthorList(piece) {
    // TODO: figure out how to handle localization better
    const numAuthors = piece._author.length;
    if (numAuthors === 1) {
      return piece._author[0].title;
    } else {
      let list = [];
      piece._author.forEach((author, index) => {
        if (index === numAuthors - 1) {
          list.push(`and ${ author.title }`);
        } else {
          list.push(author.title);
        }
      });
      return list.join(', ');
    }
  }

  function getFirstTwo(pieces) {
    // TODO: use getFirstN()? deprecate?
    if (pieces[1]) {
      return [
        pieces[0],
        pieces[1],
      ];
    } else {
      return[pieces[0]];
    }
  }

  function getFirstN(pieces, amount) {
    const numPieces = pieces.length;
    if (numPieces < amount) {
      return pieces;
    } else {
      return pieces.slice(0, amount);
    }
  }

  function getFirstTwoWithTags(pieces, tags) {
    const filtered = getWithTags(pieces, tags);
    return getFirstTwo(filtered);
  }

  function getSanitizedType(piece) {
    const presentableTypes = [
      'article',
      'book',
      'education',
      'event',
      'media',
      'organization',
      'person',
      'project',
    ];

    if (presentableTypes.includes(piece.type)) {
      return piece.type;
    } else {
      return 'page';
    }
  }

  function getWithTags(pieces, tags) {
    if (!pieces) {
      return [];
    }

    if (!tags || !tags.length) {
      return pieces;
    }

    let response = [];

    pieces.forEach(piece => {
      piece.tags.forEach(tag => {
        if (tags.includes(tag)) {
          pushNoDuplicate(response, piece);
        }
      })
    });

    return response;
  }

  function getWithoutTags(pieces, tags) {
    if (!pieces) {
      return [];
    }

    let excluded = [];
    pieces.forEach(piece => {
      piece.tags.forEach(tag => {
        if (tags.includes(tag)) {
          pushNoDuplicate(excluded, piece);
        }
      })
    });

    response = pieces.filter(
      (p) => {
        return !excluded.includes(p);
      }
    );

    return response;
  }


  // media-related methods
  function getMediaWithType(pieces, type) {
    return pieces.filter(piece => piece.mediumType === type);
  }


  // utils
  function pushNoDuplicate(array, piece) {
    let isAlreadyAdded = false;
    array.forEach(p => {
      if (p._id === piece._id) {
        isAlreadyAdded = true;
      }
    });
    if (!isAlreadyAdded) {
      array.push(piece);
    }
  }
}
