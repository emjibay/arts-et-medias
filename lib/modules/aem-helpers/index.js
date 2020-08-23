const _ = require('lodash');


module.exports = {
  extend: 'apostrophe-module',
  alias: 'aem',
  label: 'AEM Helpers',
  construct,
};


function construct(self) {
  const { apos, } = self;

  // add helpers
  self.addHelpers({
    formatMailTo,
    formatTelHref,
    getImageBasicData,
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

      /* eslint-disable eqeqeq */
      // add tel prefix
      if (onlyDigits[0] == 1) {
        response = 'tel:+' + onlyDigits;
      } else {
        response = 'tel:+1' + onlyDigits;
      }
      /* eslint-enable eqeqeq */
    }

    return response;
  }


  // image
  function getImageBasicData(imageData) {
    let response = undefined;

    if (imageData) {
      response = {
        url: apos.attachments.url(imageData),
        caption: imageData._title,
        credit: imageData._credit,
      };
      if (imageData._description) {
        response.alt = imageData._description;
      } else if (imageData._title) {
        response.alt = imageData._title;
      }

    } else {

      response = {
        url: '/img/missing-image.png',
        alt: '',
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


  // sorting methods
  function sortByTitle(pieces) {
    return _.orderBy(pieces, ['title', ], ['asc', ]);
  }
}
