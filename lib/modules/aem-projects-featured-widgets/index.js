module.exports = {
  extend: 'apostrophe-pieces-widgets',
  piecesModuleName: 'aem-projects',
  label: 'Featured Project',
  options: {
    // TODO: ensure limit is applied
    limit: 1,
  },
  searchable: false,
  filters: {
    projection: {
      title: 1,
      heroImage: 1,
      description: 1,
      _url: 1,
    }
  }
};
