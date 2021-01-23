const ArticleTypes = require('../constants/article-types');
const getCountry = require('./get-country');


module.exports = toJsonCsl;


/**
 * @param {ApostropheCMS Piece} piece
 * @param {Object} options
 * - locale {String}
 */
function toJsonCsl(piece, options) {
  // error checks
  if (!piece) {
    throw new Error(
      'toJsonCsl() expected an Apostrophe piece, '
      + 'but nothing was provided.'
    );
  }

  const { authors, locale } = options;

  let response = {};

  // === TITLE ===
  response.title = piece.title;

  // === TYPE ===
  response.type = piece.citationType;

  // === AUTHORS ===
  if (authors) {
    const formattedAuthors = [];
    authors.forEach(a => {
      if (a.type === 'person') {
        formattedAuthors.push({
          given: a.firstName,
          family: a.lastName,
        });
      } else {
        formattedAuthors.push({ literal: a.title });
      }
    });
    response.author = formattedAuthors;
  }

  // === PUBLICATION DATE ===
  response.issued = {
    'date-parts': [piece.publicationDate.split('-')],
  };
  // response.date = piece.publicationDate;

  // === PER-TYPE PROPS ===
  const publisherPlace = buildPublisherPlace(piece, locale);
  switch (response.type) {
  case ArticleTypes.BLOG_POST:
    if (piece.citationPublisher) {
      response.container = piece.citationPublisher;
    }
    break;

  case ArticleTypes.WEB_PAGE:
    if (piece.citationPublisher) {
      response.container = piece.citationPublisher;
    }
    break;

  case ArticleTypes.MAGAZINE_ARTICLE:
    if (piece.citationPublisher) {
      response.publisher = piece.citationPublisher;
    }
    if (publisherPlace) {
      response['publisher-place'] = publisherPlace;
    }
    if (piece.citationVolume) {
      response.volume = piece.citationVolume;
    }
    if (piece.citationIssue) {
      response.issue = piece.citationIssue;
    }
    if (piece.citationISSN) {
      response.ISSN = piece.citationISSN;
    }
    if (piece.citationPages) {
      response.page = piece.citationPages;
    }
    break;

  case ArticleTypes.NEWSPAPER_ARTICLE:
    if (piece.citationPublisher) {
      response.publisher = piece.citationPublisher;
    }
    if (publisherPlace) {
      response['publisher-place'] = publisherPlace;
    }
    if (piece.citationVolume) {
      response.volume = piece.citationVolume;
    }
    if (piece.citationISSN) {
      response.ISSN = piece.citationISSN;
    }
    if (piece.citationPages) {
      response.page = piece.citationPages;
    }
    break;

  case ArticleTypes.CONFERENCE_PAPER:
    if (piece.citationPublisher) {
      response.publisher = piece.citationPublisher;
    }
    if (publisherPlace) {
      response['publisher-place'] = publisherPlace;
    }
    if (piece.citationVolume) {
      response.volume = piece.citationVolume;
    }
    if (piece.citationDOI) {
      response.DOI = piece.citationDOI;
    }
    if (piece.citationISBN) {
      response.ISBN = piece.citationISBN;
    }
    if (piece.citationPages) {
      response.page = piece.citationPages;
    }
    break;

  case ArticleTypes.JOURNAL_ARTICLE:
    if (piece.citationPublisher) {
      response.publisher = piece.citationPublisher;
    }
    if (publisherPlace) {
      response['publisher-place'] = publisherPlace;
    }
    if (piece.citationVolume) {
      response.volume = piece.citationVolume;
    }
    if (piece.citationIssue) {
      response.issue = piece.citationIssue;
    }
    if (piece.citationDOI) {
      response.DOI = piece.citationDOI;
    }
    if (piece.citationISSN) {
      response.ISSN = piece.citationISSN;
    }
    if (piece.citationPages) {
      response.page = piece.citationPages;
    }
    break;

  case ArticleTypes.MANUSCRIPT:
    if (piece.citationPublisher) {
      response.publisher = piece.citationPublisher;
    }
    if (publisherPlace) {
      response['publisher-place'] = publisherPlace;
    }
    break;
  }

  // === URL ===
  if (piece.citationURL) {
    response.URL = piece.citationURL;
  } else {
    if (piece.articleType === 'original') {
      response.URL = `https://arts-et-medias${ piece._url }`;
    } else if (piece.articleType === 'mention') {
      if (piece.externalLink) {
        response.URL = piece.externalLink;
      }
    }
  }

  return response;
}

// utils
function buildPublisherPlace(piece, locale) {
  const responseArray = [];

  if (piece.citationCity) {
    responseArray.push(piece.citationCity);
  }

  if (piece.citationCountry) {
    if (locale) {
      responseArray.push(getCountry(piece.citationCountry, locale));
    } else {
      responseArray.push(piece.citationCountry);
    }
  }

  if (responseArray.length) {
    return responseArray.join(', ');
  } else {
    return null;
  }
}
