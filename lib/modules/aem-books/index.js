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
      "help": "Two-letter country ISO code (e.g. CA, US) as described in the ISO 3166 international standard.",
      name: 'publisherCountry',
      type: 'string',
      required: false,
    },
    {
      label: 'Language',
      help: 'Two-letter language ISO code (e.g. EN, FR) as described in the ISO 639-1 international standard.',
      name: 'originalLang',
      type: 'string',
      required: true
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
        'originalLang',
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
