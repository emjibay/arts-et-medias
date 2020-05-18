module.exports = {
  extend: 'apostrophe-pieces-widgets',
  piecesModuleName: 'aem-education',
  label: 'Featured Program or Workshop',
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
      _institution: 1,
      _url: 1,
    }
  }
};
