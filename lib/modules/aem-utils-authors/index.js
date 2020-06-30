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
  function formatAPA(authors, options) {
    // options = {
    //   isEditor: true|false,
    // }

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

  function formatChicago(authors, options) {
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

  function formatMLA(authors, options) {
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
    // TODO: distinguish original/mention/translated
    if (!piece._originalAuthor) {
      return '';
    }

    return getList(piece._originalAuthor);
  }

  function getListFromPiece(piece) {
    return getList(piece._author);
  }

  // private methods
  function getList(authors) {
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
