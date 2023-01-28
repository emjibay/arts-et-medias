const copyField = require('../../utils/copy-field');

const DescriptionField = require('../../fields/rich-text-description.json');

const NotesField = copyField(
  DescriptionField,
  {
    label: 'Notes',
    name: 'notes',
    help: '⚠️ Sponsors may view these notes, ensure to remain professional and respectful.',
    required: false,
  }
);

module.exports = {
  extend: 'apostrophe-pieces',
  name: 'sponsor',
  label: 'Sponsor',
  pluralLabel: 'Sponsors',
  searchable: false,
  addFields: [
    // reverse relations
    {
      name: '_banners',
      type: 'joinByOneReverse',
      withType: 'banner',
      filters: {
        projection: {
          _url: 1,
          title: 1,
        },
      },
    },

    ...NotesField,
  ],
  arrangeFields: [
    {
      label: 'Basics',
      name: 'basics',
      fields: [
        'title',
        'notes',
      ],
    },
    {
      label: 'CMS Properties',
      name: 'aposProps',
      fields: [
        'slug',
        'tags',
        'published',
        'trash',
      ],
    },
  ],
};
