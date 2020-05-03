const AuthorField = require('../../fields/author.json');
const DescriptionField = require('../../fields/description.json');
const WebsiteField = require('../../fields/website.json');
const YearPublishedField = require('../../fields/year-published.json');

module.exports = {
  extend: 'apostrophe-pieces',
  name: 'book',
  label: 'Book',
  pluralLabel: 'Books',
  addFields: [
    {
      label: 'Publisher Name',
      help: '',
      name: 'publisherName',
      type: 'string',
      required: false,
    },
    {
      label: 'Publisher City',
      help: '',
      name: 'publisherCity',
      type: 'string',
      required: false,
    },
    {
      label: 'Publisher State',
      help: '',
      name: 'publisherState',
      type: 'string',
      required: false,
    },
    {
      label: 'Publisher Country',
      help: '',
      name: 'publisherCountry',
      type: 'string',
      required: false,
    },
    ...AuthorField,
    ...DescriptionField,
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
        'website',
      ]
    },
    {
      label: 'Publisher',
      name: 'publisher',
      fields: [
        'publisherName',
        'publisherCity',
        'publisherState',
        'publisherCountry',
        'yearPublished',
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
