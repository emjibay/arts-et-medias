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
    getAuthorList,
    getFirstN,
    getFirstTwoWithTags,
    getISODate,
    getMediaWithType,
    getSanitizedType,
    getWithoutTags,
    getWithTags,
    hasHeroImage,
    hasProfilePic,
    hasTags,
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

  // FIXME: use __ instead i18n
  function getArticleSection(article) {
    // error checks
    if (!article) {
      log.warning(
        'getArticleSection() an `article` object as parameter. '
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

    if (tags.includes('news')) {
      return 'News';

    } else if (tags.includes('essay')) {
      return 'Essays and Other Texts';

    } else if (tags.includes('review')) {
      return 'Reviews and Critiques';

    } else if (tags.includes('interview')) {
      return 'Interviews';

    } else if (tags.includes('academic paper')) {
      return 'Academic Papers';

    } else if (tags.includes('conference')) {
      return 'Conference Proceedings';
    }
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

  function getAuthorList(piece) {
    // error checks
    if (!piece) {
      throw new Error(
        'getAuthorList() expects `piece`, an instance of an ApostropheCMS piece, as a parameter.'
      );
    }
    if (!piece._author) {
      const errorMessage = 'getAuthorList() expects `piece`, '
      + 'an instance of an ApostropheCMS piece '
      + 'to have the `_author` property. ';

      // TODO: convert to error once is fixed
      log.critical(
        errorMessage
        + 'Ensure to fix this issue, '
        + 'this warning will be throwing an error instead in next release.'
      );
      log.info(`title: ${ piece.title }`);

      return '';
    }

    const numAuthors = piece._author.length;
    if (numAuthors === 1) {
      return piece._author[0].title;
    } else {
      let list = [];
      piece._author.forEach((author) => {
        list.push(author.title);
      });
      return list.join(', ');
    }
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

    let excluded = [];
    pieces.forEach(piece => {
      piece.tags.forEach(tag => {
        if (tags.includes(tag)) {
          excluded = arrayUtils.pushUnique(excluded, piece);
        }
      });
    });

    const response = pieces.filter(
      (p) => {
        return !excluded.includes(p);
      }
    );

    return response;
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


  // media-related methods
  function getMediaWithType(pieces, type) {
    return pieces.filter(piece => piece.mediumType === type);
  }
}
