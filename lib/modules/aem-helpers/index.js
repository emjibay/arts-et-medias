const _ = require('lodash');


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
    formatMailTo,
    formatTelHref,
    getCleanLocaleStr,
    getImageBasicData,
    getLocalizedURL,
    getMinimalOGData,
    getOppositeLocaleStr,
    getOppositeLocaleURL,
    isUserAdmin,
    isUserGuest,
    mergeClassLists,
    nl2br,
  });


  // api definitions
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

    } else {
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

  function getOppositeLocaleStr(data) {
    let response = undefined;

    const locale = getCleanLocaleStr(data);

    if (locale.toLowerCase() === 'en') {
      response = 'fr';
    } else {
      response = 'en';
    }
    return response;
  }

  function getOppositeLocaleURL(data, locales) {
    const currentLocale = getCleanLocaleStr(data);
    const oppositeLocale = locales.find(({ workflowLocale }) => workflowLocale !== currentLocale);

    if (oppositeLocale && oppositeLocale._url) {
      return oppositeLocale._url;
    } else {
      const oppositeLocaleStr = getOppositeLocaleStr(data);
      return `/${oppositeLocaleStr}/`;
    }
  }


  // url methods
  function getLocalizedURL(data, source) {
    // error checks
    const errorPrefix = 'Error at apos.vki.getLocalizedURL(): ';
    if (!data) {
      throw new Error(
        errorPrefix
        + 'First argument `data` is expected, and none was provided.'
      );
    }
    if (!source) {
      throw new Error(
        errorPrefix
        + 'Second argument `source` is expected, and none was provided.'
      );
    }

    let localized = undefined;
    if (source.indexOf('en/') === 0 || source.indexOf('fr/') === 0) {
      // localized, missing slash as first character
      localized = '/' + source;

    } if (source.indexOf('/en/') === 0 || source.indexOf('/fr/') === 0) {
      // localized
      localized = source;

    } else {
      // build localized url
      localized = '/' + getCleanLocaleStr(data);
      if (source[0] !== '/') {
        localized += '/';
      }
      localized += source;
    }

    return localized;
  }


  // user methods
  function isUserAdmin(user) {
    let isAdmin = false;
    if (user) {
      isAdmin = isUserInGroup(user, 'admin');
    }
    return isAdmin;
  }

  function isUserGuest(user) {
    let isGuest = false;
    if (user) {
      isGuest = isUserInGroup(user, 'guest');
    }
    return isGuest;
  }

  function isUserInGroup(user, groupTitle) {
    // error checks
    const errorPrefix = 'Error at apos.vki.isUserInGroup(): ';
    if (!user) {
      throw new Error(
        errorPrefix
        + 'Argument `user` is expected, and none was provided.'
      );
    }
    if (!groupTitle) {
      throw new Error(
        errorPrefix
        + 'Argument `groupTitle` is expected, and none was provided.'
      );
    }

    let isInGroup = false;

    user._groups.forEach(group => {
      if (group.title === groupTitle) {
        isInGroup = true;
      }
    });

    return isInGroup;
  }


  // opengraph methods
  function getMinimalOGData(data) {
    const { global } = data;

    const response = {
      title: data.page.title + ' | ' + global.vkiLabel,
      url: data.baseUrl + data.page._url,
      imageUrl: data.baseUrl + '/img/icon-opengraph.png',
    };

    return response;
  }
}
