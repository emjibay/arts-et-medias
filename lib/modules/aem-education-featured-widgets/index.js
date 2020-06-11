module.exports = {
  extend: 'apostrophe-pieces-widgets',
  piecesModuleName: 'aem-education',
  label: 'Featured Program or Workshop',
  searchable: false,
  filters: {
    projection: {
      title: 1,
      heroImage: 1,
      description: 1,
      _institution: 1,
      _url: 1,
    }
  },
  addFields: [
    {
      label: 'Is this program/workshop sponsored?',
      help: 'Sponsored content is paid for, otherwise it is simply featured content',
      name: 'isSponsored',
      type: 'boolean',
      required: true,
    },
  ],
};
