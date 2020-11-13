module.exports = toJsonCsl;


function toJsonCsl(piece) {
  // error checks
  if (!piece) {
    throw new Error(
      'toJsonCsl() expected an Apostrophe piece, '
      + 'but nothing was provided.'
    );
  }

  let response = {};

  // === TITLE ===
  if (piece.subtitle) {
    response.title = `${piece.title}: ${piece.subtitle}`;
  } else {
    response.title = piece.title;
  }
  response['title-short'] = piece.title;

  // === PEOPLE ===

  // authors/editors
  const authors = [];
  if (piece._author) {
    piece._author.forEach(a => {
      authors.push({
        given: a.firstName,
        family: a.lastName,
      });
    });
  }
  if (piece.isEditor) {
    response.editor = authors;
  } else {
    response.author = authors;
  }

  // translator
  if (piece._translator) {
    response.translator = [];
    piece._translator.forEach(t => {
      response.translator.push({
        given: t.firstName,
        family: t.lastName,
      });
    });
  }

  // === PUBLICATION ===

  // date
  response.issued = {
    'date-parts': [[piece.yearPublished]],
  };

  // publication type
  response.type = 'book';
  // TODO: make distinction between book type and others?

  // publisher
  response.publisher = piece.publisherName;

  // place
  let publisherPlace = `${piece.publisherCity}, `;
  if (piece.publisherState) {
    publisherPlace += `${piece.publisherState}, `;
  }
  publisherPlace += piece.publisherCountry;
  response['publisher-place'] = publisherPlace;

  return response;
}
