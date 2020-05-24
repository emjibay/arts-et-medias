const IsSponsoredField = require('../../fields/is-sponsored.json');


module.exports = {
  extend: 'apostrophe-pieces-widgets',
  piecesModuleName: 'aem-articles',
  label: 'Featured Article',
  options: {
    // FIXME: limit is not applied
    limit: 1,
    limitByAll: 1,
  },
  searchable: false,
  filters: {
    projection: {
      title: 1,
      heroImage: 1,
      shortDescription: 1,
      _originalAuthor: 1,
      _url: 1,
    }
  },
  addFields: [
    ...IsSponsoredField,
  ],
};
