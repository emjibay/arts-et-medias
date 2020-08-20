module.exports = {
  extend: 'apostrophe-pieces-widgets',
  piecesModuleName: 'aem-books',
  label: 'Featured Book',
  searchable: false,
  filters: {
    projection: {
      title: 1,
      heroImage: 1,
      description: 1,
      shortDescription: 1,
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
