module.exports = {
  extend: 'apostrophe-pieces-widgets',
  piecesModuleName: 'aem-books',
  label: 'Featured Book',
  options: {
    // TODO: ensure limit is applied
    limit: 1,
    limitByAll: 1,
  },
  searchable: false,
  filters: {
    projection: {
      title: 1,
      heroImage: 1,
      description: 1,
      _author: 1,
      _url: 1,
    }
  },
  addFields: [
    {
      label: 'Is this book sponsored?',
      help: 'Sponsored content is paid for, otherwise it is simply featured content',
      name: 'isSponsored',
      type: 'boolean',
      required: true,
    },
  ],
};
