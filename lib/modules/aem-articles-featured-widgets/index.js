module.exports = {
  extend: 'apostrophe-pieces-widgets',
  piecesModuleName: 'aem-articles',
  label: 'Featured Article',
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
      _originalAuthor: 1,
      _url: 1,
    }
  },
  addFields: [
    {
      label: 'Is this article sponsored?',
      help: 'Sponsored content is paid for, otherwise it is simply featured content',
      name: 'isSponsored',
      type: 'boolean',
      required: true,
    },
  ],
};
