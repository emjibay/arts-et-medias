module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemAuthors',
  label: 'AEM Authors Utils',
  construct,
};


function construct(self, options) {
  self.addHelpers({
    getArrayFromArticle,
    getArrayFromPiece,
    getListFromArticle,
    getListFromPiece,
  });


  // public methods
  function getArrayFromPiece(piece) {
    // error checks
    if (!piece) {
      throw new Error(
        'getArrayFromPiece() expects `piece`, '
        + 'an instance of an ApostropheCMS piece, as a parameter.'
      );
    }

    return getTitleArray(piece._author);
  }

  function getArrayFromArticle(piece) {
    // error checks
    if (!piece) {
      throw new Error(
        'getArrayFromArticle() expects `piece`, '
        + 'an instance of an ApostropheCMS piece, as a parameter.'
      );
    }

    // TODO: distinguish original/mention/translated
    if (!piece._originalAuthor) {
      return '';
    }

    return getTitleArray(piece._originalAuthor);
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
  function getTitleArray(authors) {
    // error checks
    if (!authors) {
      throw new Error(
        'getTitleArray() expects an array of authors as a parameter.'
      );
    }

    const list = [];
    authors.forEach((author, index) => {
      list.push(author.title);
    });

    return list;
  }

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
