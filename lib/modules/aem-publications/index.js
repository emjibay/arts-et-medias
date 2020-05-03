const DescriptionField = require('../../fields/description.json');
const NameField = require('../../fields/name.json');
const WebsiteField = require('../../fields/website.json');

module.exports = {
  extend: 'apostrophe-pieces',
  name: 'publication',
  label: 'Publication',
  pluralLabel: 'Publications',
  addFields: [
    ...DescriptionField,
    ...NameField,
    ...WebsiteField,
  ],
  arrangeFields: [
    {
      label: 'Basics',
      name: 'basics',
      fields: [
        'title',
        'description',
        'website',
      ]
    },
    {
      label: 'Meta',
      name: 'meta',
      fields: [
        'tags',
        'slug',
        'published',
        'trash',
      ]
    }
  ],
};
