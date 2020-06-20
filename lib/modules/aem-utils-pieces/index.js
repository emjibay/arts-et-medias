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
    getBooksWritten,
    getFirstTwo,
    getFirstTwoWithTags,
    getMediaWithType,
    getProjectsCreated,
    getRelatedArtCenters,
    getRelatedCollectives,
    getRelatedGalleries,
    getRelatedMediaLabs,
    getRelatedWorkshops,
    getSanitizedType,
    getWithTags,
    getWithoutTags,
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
      throw new Error('Expected an array (`pieces`), but none was provided.');
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
      throw new Error('Expected an array (`pieces`), but none was provided.');
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


  // people-related methods
  function getBooksWritten() {
    if (!piece || !piece._author) {
      return [];
    }

    return piece._author.filter(element => element.type === 'book');
  }

  function getProjectsCreated() {
    if (!piece || !piece._author) {
      return [];
    }

    return piece._author.filter(element => element.type === 'project');
  }

  function getRelatedArtCenters(piece) {
    if (!piece || !piece._relatedPeople) {
      return [];
    }

    const orgs = piece._relatedPeople.filter(element => element.type === 'organization');
    return getWithTags(orgs, ['art center']);
  }

  function getRelatedCollectives(piece) {
    if (!piece || !piece._relatedPeople) {
      return [];
    }

    const orgs = piece._relatedPeople.filter(element => element.type === 'organization');
    return getWithTags(orgs, ['collective']);
  }

  function getRelatedGalleries(piece) {
    if (!piece || !piece._relatedPeople) {
      return [];
    }

    const orgs = piece._relatedPeople.filter(element => element.type === 'organization');
    return getWithTags(orgs, ['gallery', 'museum']);
  }

  function getRelatedMediaLabs(piece) {
    if (!piece || !piece._relatedPeople) {
      return [];
    }

    const orgs = piece._relatedPeople.filter(element => element.type === 'organization');
    return getWithTags(
      orgs,
      [
        'media lab',
        'archives',
        'art research',
        'research',
        'research-creation',
      ]
    );
  }

  function getRelatedWorkshops(piece) {
    if (!piece || !piece._relatedPeople) {
      return [];
    }

    const events = piece._relatedPeople.filter(element => element.type === 'event');
    return getWithTags(events, ['workshop']);
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
