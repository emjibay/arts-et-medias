const _ = require('lodash');

const arrayUtils = require('../../utils/array');
const log = require('../../utils/log');


module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemPieces',
  label: 'AEM Pieces Utils',
  construct,
};


function construct(self, options) {
  self.addHelpers({
    doesWidgetHaveContent,
    getArticleSection,
    getAtPage,
    getFirstN,
    getFirstNWithTags,
    getFirstTwoWithTags,
    getISODate,
    getMediaWithType,
    getSanitizedType,
    getWithoutTags,
    getWithTags,
    hasHeroImage,
    hasProfilePic,
    hasTags,
    sortByTitle,
  });

  function doesWidgetHaveContent(widget) {
    // error checks
    if (!widget) {
      throw new Error(
        'doesWidgetHaveContent() expected an ApostropheCMS `widget` object as a parameter.'
      );
    }

    return (widget._pieces && widget._pieces.length > 0);
  }

  function getAtPage(pieces, pageNumber) {
    let response = [];

    // error checks
    if (!pieces) {
      log.warning(
        'getAtPage() expects `pieces`, an array of ApostropheCMS pieces, as first parameter. '
        + 'None was provided, an empty array will be returned.'
      );
      return response;
    }
    if (!pageNumber || isNaN(pageNumber) || pageNumber < 0) {
      log.warning(
        'getFirstN() expects `pageNumber`, a positive integer, as second parameter. '
        + '`pageNumber` will be set to 1.'
      );
      pageNumber = 1;
    }

    // get elements on page
    const resultsPerPage = 10;
    const startIndex = (pageNumber - 1) * resultsPerPage;
    const lastIndex = startIndex + resultsPerPage;
    for (let i = startIndex; i < lastIndex; i++) {
      const element = pieces[i];
      if (element) {
        response.push(element);
      }
    }

    return response;
  }

  function getISODate(piece) {
    // error checks
    if (!piece) {
      throw new Error(
        'getISODate() expects `piece`, an instance of an ApostropheCMS piece, as a parameter.'
      );
    }

    if (!piece.publicationDate) {
      return null;
    }
    return new Date(piece.publicationDate).toISOString();
  }

  function getFirstN(pieces, amount) {
    // error checks
    if (!pieces) {
      log.warning(
        'getFirstN() expects `pieces`, an array of ApostropheCMS pieces, as first parameter. '
        + 'None was provided, an empty array will be returned.'
      );
      return [];
    }
    if (!amount || isNaN(amount) || amount < 0) {
      log.warning(
        'getFirstN() expects `amount`, a positive integer, as second parameter. '
        + 'None was provided, an empty array will be returned.'
      );
      return [];
    }

    const numPieces = pieces.length;

    if (numPieces) {
      if (numPieces < amount) {
        return pieces;
      } else {
        return pieces.slice(0, amount);
      }
    } else {
      return [];
    }
  }

  function getFirstNWithTags(pieces, amount, tags) {
    const withTags = getWithTags(pieces, tags);
    return getFirstN(withTags, amount);
  }

  function getFirstTwoWithTags(pieces, tags) {
    const filtered = getWithTags(pieces, tags);
    return getFirstN(filtered, 2);
  }

  function getSanitizedType(piece) {
    // error checks
    if (!piece) {
      throw new Error(
        'hasHeroImgetSanitizedTypeage() expects `piece`, '
        + 'an instance of an ApostropheCMS piece, as a parameter.'
      );
    }

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
    // error checks
    if (!pieces) {
      log.warning(
        'getWithTags() expects `pieces`, an array of ApostropheCMS pieces, as first parameter. '
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

  function getWithoutTags(pieces, tags) {
    // error checks
    if (!pieces) {
      log.warning(
        'getWithoutTags() expects `pieces`, an array of ApostropheCMS pieces, as first parameter. '
        + 'None was provided, an empty array will be returned.'
      );
      return [];
    }

    return _.difference(
      pieces,
      getWithTags(pieces, tags)
    );
  }

  function hasHeroImage(piece) {
    // error checks
    if (!piece) {
      throw new Error(
        'hasHeroImage() expects `piece`, an instance of an ApostropheCMS piece, as a parameter.'
      );
    }

    return (
      piece.heroImage
      && piece.heroImage.items
      && piece.heroImage.items.length > 0
    );
  }

  function hasProfilePic(piece) {
    // error checks
    if (!piece) {
      throw new Error(
        'hasProfilePic() expects `piece`, an instance of an ApostropheCMS piece, as a parameter.'
      );
    }

    return (
      piece.profilePic
      && piece.profilePic.items
      && piece.profilePic.items.length > 0
    );
  }

  function hasTags(page) {
    // error checks
    if (!page) {
      throw new Error(
        'hasTags() expects `page`, an instance of an ApostropheCMS page, as a parameter.'
      );
    }

    return (page.withTags && page.withTags.length > 0);
  }

  function sortByTitle(pieces) {
    return _.orderBy(pieces, ['title' ], ['asc' ]);
  }


  // articles-related methods
  function getArticleSection(__, article) {
    // error checks
    if (!article) {
      log.warning(
        'getArticleSection() expected an `article` object as parameter. '
        + 'None was provided, an empty string will be returned.'
      );
      return '';
    }

    // error checks
    const { tags } = article;
    if (!tags || (tags && !tags.length)) {
      log.warning(
        'No tags were found in article, an empty string will be returned.'
      );
      return '';
    }

    if (arrayUtils.intersect(tags, __('articles|categories|news|tags'))) {
      return __('articles|categories|news|title');

    } else if (arrayUtils.intersect(tags, __('articles|categories|essays|tags'))) {
      return __('articles|categories|essays|title');

    } else if (arrayUtils.intersect(tags, __('articles|categories|reviews|tags'))) {
      return __('articles|categories|reviews|title');

    } else if (arrayUtils.intersect(tags, __('articles|categories|interviews|tags'))) {
      return __('articles|categories|interviews|title');

    } else if (arrayUtils.intersect(tags, __('articles|categories|academicPapers|tags'))) {
      return __('articles|categories|academicPapers|title');

    } else if (arrayUtils.intersect(tags, __('articles|categories|conferenceProceedings|tags'))) {
      return __('articles|categories|conferenceProceedings|title');
    }
  }


  // media-related methods
  function getMediaWithType(pieces, type) {
    return pieces.filter(piece => piece.mediumType === type);
  }
}
