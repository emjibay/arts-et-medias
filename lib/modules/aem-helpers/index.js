const _ = require('lodash');
const moment = require('moment');


module.exports = {
  extend: 'apostrophe-module',
  alias: 'aem',
  label: 'AEM Helpers',
  construct: constructHelpers
};


function constructHelpers(self, options) {
  const { apos } = self;

  // add helpers
  self.addHelpers({
    formatAuthorsAPA,
    formatAuthorsChicago,
    formatAuthorsMLA,
    formatDate,
    formatMailTo,
    formatTelHref,
    getCleanLocaleStr,
    getImageBasicData,
    getPiecesAtPage,
    getPiecesWithTags,
    mergeClassLists,
    nl2br,
    sortByTitle,
  });


  // href
  function formatMailTo(source) {
    // method takes for granted that source argument is valid email
    let response = undefined;

    if (source && typeof source === 'string') {
      if (source.indexOf('mailto:') === -1) {
        response = 'mailto:' + source;
      } else {
        response = source;
      }
    }

    return response;
  }

  function formatTelHref(source) {
    let response = undefined;

    if (source && typeof source === 'string') {
      // get only numbers
      const onlyDigits = source.replace(/\D/g, '');

      // add tel prefix
      // NOTE: double equal is intentional
      if (onlyDigits[0] == 1) {
        response = 'tel:+' + onlyDigits;
      } else {
        response = 'tel:+1' + onlyDigits;
      }
    }

    return response;
  }


  // image
  function getImageBasicData(imageData) {
    let response = undefined;

    if (imageData) {
      response = {
        url: apos.attachments.url(imageData),
        alt: imageData._description
      };
    } else {

      response = {
        url: '/img/missing-image.png',
        alt: ''
      };
    }

    if (!response.url) {
      response.url = '/img/missing-image.png';
    }

    if (!response.alt) {
      response.alt = '';
    }

    return response;
  }


  // string manipulation
  function formatAuthorsAPA(authors) {
    let response = '';

    numAuthors = authors.length;
    if (authors.length === 1) {
      response = `${authors[0].lastName}, ${authors[0].firstName.substr(0, 1)}.`;

    } else if (authors.length === 2) {
      authors.forEach((author, index) => {
        const formatted = `${author.lastName}, ${author.firstName.substr(0, 1)}.`;
        if (index === 0) {
          response = formatted;
        } else if (index < numAuthors - 1) {
          response = `${response}, ${formatted}`;
        } else {
          response = `${response} & ${formatted}`;
        }
      });
    }

    return response;
  }

  function formatAuthorsChicago(authors) {
    let response = '';

    if (authors.length === 1) {
      response = `${authors[0].firstName} ${authors[0].lastName}`;

    } else if (authors.length === 2) {
      response = `${authors[0].firstName} ${authors[0].lastName} and ${authors[1].firstName} ${authors[1].lastName}`;

    } else {
      response = `${authors[0].firstName} ${authors[0].lastName} et al.`;
    }

    return response;
  }

  function formatAuthorsMLA(authors) {
    let response = `${authors[0].lastName}, ${authors[0].firstName}`;

    numAuthors = authors.length;
    if (authors.length === 2) {
      response = `${response} and ${authors[1].firstName} ${authors[1].lastName}`;

    } else if (authors.length > 2) {
      response = `${response} et al`;
    }

    return response;
  }

  function nl2br(string) {
    // filter should exist in nunjucks, but actually throws an error
    // see https://mozilla.github.io/nunjucks/templating.html#nl2br
    return string.replace(/\r|\n|\r\n/g, '<br />');
  }


  // css manipulation methods
  function mergeClassLists(list1, list2) {
    let response = '';

    if (Array.isArray(list1)) {
      response += list1.join(' ');

    } else if (typeof list1 === 'string') {
      response += list1;
    }

    response += ' ';

    if (Array.isArray(list2)) {
      response += list2.join(' ');

    } else if (typeof list2 === 'string') {
      response += list2;
    }

    return response;
  }


  // locale methods
  function getCleanLocaleStr(data) {
    return data.locale.replace('-draft', '');
  }

  function formatDate(date) {
    // TODO: adapt per lang
    return moment(date).format('MMM D, YYYY');
  }


  // sorting methods
  function sortByTitle(pieces) {
    return _.orderBy(pieces, ['title'], ['asc']);
  }


  // pieces methods
  function getPiecesWithTags(pieces, tags) {
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

  function getPiecesAtPage(pieces, pageNumber) {
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
}
