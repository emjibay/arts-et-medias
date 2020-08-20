module.exports = {
  extend: 'apostrophe-pieces-widgets',
  piecesModuleName: 'aem-events',
  label: 'Featured Event',
  searchable: false,
  filters: {
    projection: {
      title: 1,
      heroImage: 1,
      description: 1,
      shortDescription: 1,
      startDate: 1,
      city: 1,
      country: 1,
      _url: 1,
    }
  },
  addFields: [
    {
      label: 'Is this feature sponsored?',
      help: 'Sponsored content is paid for, otherwise it is simply featured content',
      name: 'isSponsored',
      type: 'boolean',
      required: true,
    },
  ],
};
