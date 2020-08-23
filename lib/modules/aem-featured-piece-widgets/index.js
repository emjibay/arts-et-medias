module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Featured Piece',
  addFields: [
    {
      label: 'Piece',
      help: '',
      name: '_piece',
      type: 'joinByOne',
      withType: [
        'article',
        'book',
        'education',
        'event',
        'media',
        'organization',
        'person',
        'project',
      ],
    },
  ],
};
