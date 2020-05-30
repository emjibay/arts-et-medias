const MetaArrangement = require('../../arrangements/meta-no-image.json');

const copyField = require('../../../src/utils/copy-field');

const AuthorField = require('../../fields/author.json');
const DescriptionField = require('../../fields/rich-text-description.json');
const HeroImageField = require('../../fields/hero-image.json');
const ShortDescriptionField = require('../../fields/optional-short-description.json');
const WebsiteField = require('../../fields/website.json');
const YearPublishedField = require('../../fields/year-published.json');

const TranslatorField = copyField(
  AuthorField,
  {
    name: '_translator',
    label: 'Translator',
  }
);


module.exports = {
  extend: 'apostrophe-pieces',
  name: 'book',
  label: 'Book',
  pluralLabel: 'Books',
  addFields: [
    // publisher
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
      help: 'Two-letter country ISO code (e.g. CA, US) as described in the ISO 3166 international standard.',
      name: 'publisherCountry',
      type: 'string',
      required: false,
    },
    // language
    {
      label: 'Is this work a translation?',
      name: 'isTranslation',
      type: 'select',
      required: true,
      choices: [
        {
          label: 'No',
          value: false,
          showFields: [
            'lang',
          ]
        },
        {
          label: 'Yes',
          value: true,
          showFields: [
            'lang',
            'originalLang',
            '_translator',
          ]
        },
      ]
    },
    {
      label: 'Language',
      help: 'The language of the publication. Two-letter language ISO code (e.g. EN, FR) as described in the ISO 639-1 international standard.',
      name: 'lang',
      type: 'string',
      required: true
    },
    {
      label: 'Original Language',
      help: 'If this work is a translation, ensure to enter the original language. Two-letter language ISO code (e.g. EN, FR) as described in the ISO 639-1 international standard.',
      name: 'originalLang',
      type: 'string',
      required: true
    },
    ...AuthorField,
    ...DescriptionField,
    ...HeroImageField,
    ...ShortDescriptionField,
    ...TranslatorField,
    ...WebsiteField,
    ...YearPublishedField,
  ],
  arrangeFields: [
    {
      label: 'Basics',
      name: 'basics',
      fields: [
        'title',
        'heroImage',
        'description',
        '_author',
        'isTranslation',
        'lang',
        'originalLang',
        '_translator',
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
    ...MetaArrangement
  ],

  construct: function(self, options) {
    const { apos } = self;

    self.on('apostrophe-pages:beforeSend', 'fetchAEMBooks', async function(req) {
      // alphabetically ordered
      req.data.booksByTitle = await apos.docs.getManager('book').find(
        req,
        { type: 'book' }
      )
      .sort({ title: 1 }) // FIXME: sorting borks accented characters
      .toArray();

      // sorted by recently added
      req.data.booksByMostRecent = await apos.docs.getManager('book').find(
        req,
        { type: 'book' }
      )
      .sort({ createdAt: -1 })
      .toArray();
    });
  },
};
