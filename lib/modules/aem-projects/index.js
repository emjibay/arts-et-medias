const AuthorField = require('../../fields/author.json');
const DescriptionField = require('../../fields/description.json');
const NameField = require('../../fields/name.json');
const WebsiteField = require('../../fields/website.json');
const YearPublishedField = require('../../fields/year-published.json');

module.exports = {
  extend: 'apostrophe-pieces',
  name: 'project',
  label: 'Project',
  pluralLabel: 'Projects',
  addFields: [
    ...AuthorField,
    ...DescriptionField,
    ...NameField,
    ...WebsiteField,
    ...YearPublishedField,
  ],
  arrangeFields: [
    {
      label: 'Basics',
      name: 'basics',
      fields: [
        'title',
        'description',
        '_author',
        'yearPublished',
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
