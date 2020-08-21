module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemAuthors',
  label: 'AEM Authors Utils',
  construct: construct,
};

function construct(self, options) {
  self.addHelpers({
    formatAPA,
    formatChicago,
    formatMLA,
    getListFromArticle,
    getListFromPiece,
  });


  // public methods
  /**
   * @param {array} authors List of authors.
   * @param {object} options Options object:
   *   - isEditor <boolean>
   */
  function formatAPA(authors, options) {
    // error checks
    if (!authors) {
      throw new Error(
        'formatAPA() expects an array of authors as a parameter.'
      );
    }

    let response = '';

    numAuthors = authors.length;

    if (authors.length === 1) {
      response = formatAuthor(authors[0]);

    } else if (authors.length === 2) {
      response = `${ formatAuthor(authors[0]) } & ${ formatAuthor(authors[1]) }`;

    } else {
      authors.forEach((author, index) => {
        let formatted = formatAuthor(author);
        if (index === 0) {
          response = formatted;
        } else if (index < numAuthors - 1) {
          response = `${ response }, ${ formatted }`;
        } else {
          response = `${ response } & ${ formatted }`;
        }
      });
    }
    if (options && options.isEditor) {
      if (numAuthors === 1) {
        response = `${ response } (Ed.)`;
      } else {
        response = `${ response } (Eds.)`;
      }
    }

    function formatAuthor(author) {
      let formattedAuthor;
      if (author.type === 'person') {
        formattedAuthor = `${author.lastName}, ${author.firstName.substr(0, 1)}.`;
      } else {
        formattedAuthor = `${author.title}`;
      }
      return formattedAuthor;
    }

    return response;
  }

  /**
   * @param {array} authors List of authors.
   * @param {object} options Options object:
   *   - isEditor <boolean>
   */
  function formatChicago(authors, options) {
    // error checks
    if (!authors) {
      throw new Error(
        'formatChicago() expects an array of authors as a parameter.'
      );
    }

    let response = '';

    const numAuthors = authors.length;
    if (numAuthors === 1) {
      response = formatAuthor(authors[0]);

    } else if (numAuthors === 2) {
      response = `${ formatAuthor(authors[0]) } and ${ formatAuthor(authors[1]) }`;

    } else {
      response = `${ formatAuthor(authors[0]) } et al.`;
    }

    if (options && options.isEditor) {
      if (numAuthors === 1) {
        response = `${ response }, ed.`;
      } else {
        response = `${ response }, eds.`;
      }
    }

    function formatAuthor(author) {
      let formattedAuthor;
      if (author.type === 'person') {
        formattedAuthor = `${ author.firstName } ${ author.lastName }`;
      } else {
        formattedAuthor = `${ author.title }`;
      }
      return formattedAuthor;
    }

    return response;
  }

  /**
   * @param {array} authors List of authors.
   * @param {object} options Options object:
   *   - isEditor <boolean>
   */
  function formatMLA(authors, options) {
    // error checks
    if (!authors) {
      throw new Error(
        'formatMLA() expects an array of authors as a parameter.'
      );
    }

    let response = formatAuthor(authors[0]);

    numAuthors = authors.length;
    if (numAuthors === 2) {
      response = `${ response } and ${ formatAuthor(authors[1]) }`;

    } else if (numAuthors > 2) {
      response = `${ response } et al`;
    }

    if (options && options.isEditor) {
      if (numAuthors === 1) {
        response = `${ response }, ed.`;
      } else {
        response = `${ response }, eds.`;
      }
    }

    function formatAuthor(author) {
      let formattedAuthor;
      if (author.type === 'person') {
        formattedAuthor = `${ author.lastName }, ${ author.firstName }`;
      } else {
        formattedAuthor = `${ author.title }`;
      }
      return formattedAuthor;
    }

    return response;
  }

  function getListFromArticle(piece) {
    // error checks
    if (!piece) {
      throw new Error(
        'getListFromArticle() expects `piece`, '
        + 'an instance of an ApostropheCMS piece, as a parameter.'
      );
    }

    // TODO: distinguish original/mention/translated
    if (!piece._originalAuthor) {
      return '';
    }

    return getList(piece._originalAuthor);
  }

  function getListFromPiece(piece) {
    // error checks
    if (!piece) {
      throw new Error(
        'getListFromPiece() expects `piece`, '
        + 'an instance of an ApostropheCMS piece, as a parameter.'
      );
    }

    return getList(piece._author);
  }

  // private methods
  function getList(authors) {
    // error checks
    if (!authors) {
      throw new Error(
        'getList() expects an array of authors as a parameter.'
      );
    }

    let list = '';
    const numAuthors = authors.length;
    authors.forEach((author, index) => {
      list += author.title;
      if (index < numAuthors - 1) {
        list += ', ';
      }
    });

    return list;
  }
}
