const log = require('../../utils/log');


module.exports = {
  extend: 'apostrophe-module',
  alias: 'aemAuthors',
  label: 'AEM Authors Utils',
  construct,
};


function construct(self, options) {
  self.addHelpers({
    getArrayFromArticle,
    getArrayFromBook,
    getArrayFromPiece,
    getListFromArticle,
    getListFromBook,
    getListFromPiece,
  });


  // public methods
  function getArrayFromPiece(piece) {
    // error checks
    if (!piece) {
      throw new Error(
        'getArrayFromPiece() expected an instance of an ApostropheCMS piece.'
      );
    }

    return buildTitleArrayFrom(piece._author);
  }

  function getArrayFromBook(book, editorAbbreviation) {
    // TODO: error checks

    const array = [];

    // authors
    if (book._author) {
      array.push(...buildTitleArrayFrom(book._author));
    }

    // editors
    if (book._editor) {
      book._editor.forEach(editor => {
        array.push(`${editor.title} (${editorAbbreviation})`);
      });
    }

    return array;
  }

  function getArrayFromArticle(piece) {
    // error checks
    if (!piece) {
      throw new Error(
        'getArrayFromArticle() expected an instance of an ApostropheCMS piece.'
      );
    }

    // TODO: distinguish original/mention/translated
    if (!piece._originalAuthor) {
      return '';
    }

    return buildTitleArrayFrom(piece._originalAuthor);
  }

  function getListFromArticle(piece) {
    // error checks
    if (!piece) {
      throw new Error(
        'getListFromArticle() expected an instance of an ApostropheCMS piece.'
      );
    }

    // TODO: distinguish original/mention/translated
    if (!piece._originalAuthor) {
      return '';
    }

    return buildTitleListFrom(piece._originalAuthor);
  }

  function getListFromBook(book, editorAbbreviation) {
    // TODO: error checks

    const array = getArrayFromBook(book, editorAbbreviation);
    return array.join(', ');
  }

  function getListFromPiece(piece) {
    // error checks
    if (!piece) {
      throw new Error(
        'getListFromPiece() expected an instance of an ApostropheCMS piece.'
      );
    }

    if (piece.type === 'article') {
      return buildTitleListFrom(piece._originalAuthor);
    } else {
      return buildTitleListFrom(piece._author);
    }
  }

  // private methods
  function buildTitleArrayFrom(people) {
    const array = [];

    // error checks
    if (!people) {
      log.critical(
        'buildTitleArrayFrom() expected an array of people as a parameter.'
      );
      return array;
    }

    people.forEach((person) => {
      array.push(person.title);
    });

    return array;
  }

  function buildTitleListFrom(people) {
    // error checks
    if (!people) {
      log.critical(
        'buildTitleListFrom() expected an array of people as a parameter.'
      );
      return '';
    }

    const array = buildTitleArrayFrom(people);
    return array.join(', ');
  }
}
