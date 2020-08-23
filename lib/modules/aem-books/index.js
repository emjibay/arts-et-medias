const copyField = require('../../../src/utils/copy-field');

const languageHelp = require('../../constants/language-codes-help');
const countryCodeHelp = require('../../constants/country-codes-help');

const AuthorField = require('../../fields/author.json');
const DescriptionField = require('../../fields/rich-text-description.json');
const HeroImageField = require('../../fields/hero-image.json');
const RelatedMedia = require('../../fields/related-media.json');
const RelatedOrganizations = require('../../fields/related-organizations.json');
const RelatedPeople = require('../../fields/related-people.json');
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

const ContributorField = copyField(
  AuthorField,
  {
    name: '_contributor',
    label: 'Contributor',
    required: false,
  }
);

const MetaArrangement = require('../../arrangements/meta-no-image.json');

module.exports = {
  extend: 'apostrophe-pieces',
  name: 'book',
  label: 'Book',
  pluralLabel: 'Books',
  addFields: [
    // author
    {
      label: 'Is the author an editor?',
      name: 'isEditor',
      type: 'select',
      required: true,
      choices: [
        {
          label: 'No',
          value: false,
        },
        {
          label: 'Yes',
          value: true,
          showFields: [
            '_contributor',
          ],
        },
      ],
    },

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
      htmlHelp: countryCodeHelp,
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
          ],
        },
        {
          label: 'Yes',
          value: true,
          showFields: [
            'lang',
            'originalLang',
            '_translator',
          ],
        },
      ],
    },
    {
      label: 'Language',
      htmlHelp: `The language of the publication. ${languageHelp}`,
      name: 'lang',
      type: 'string',
      required: true,
    },
    {
      label: 'Original Language',
      htmlHelp: `If this work is a translation, ensure to enter the original language. ${languageHelp}`,
      name: 'originalLang',
      type: 'string',
      required: true,
    },

    // related content
    {
      label: 'Related books',
      help: '',
      name: '_relatedBooks',
      type: 'joinByArray',
      withType: ['book' ],
      filters: {
        projection: {
          '_url': 1,
          'title': 1,
        },
      },
    },

    // reverse relations
    {
      name: '_relatedArticles',
      reverseOf: '_relatedBooks',
      type: 'joinByArrayReverse',
      withType: 'article',
      filters: {
        projection: {
          '_url': 1,
          'title': 1,
        },
      },
    },
    {
      name: '_booksMentioned',
      reverseOf: '_relatedBooks',
      type: 'joinByArrayReverse',
      withType: 'book',
      filters: {
        projection: {
          _url: 1,
          title: 1,
        },
      },
    },

    ...AuthorField,
    ...ContributorField,
    ...DescriptionField,
    ...HeroImageField,
    ...RelatedMedia,
    ...RelatedOrganizations,
    ...RelatedPeople,
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
        'isEditor',
        '_contributor',
        'isTranslation',
        'lang',
        'originalLang',
        '_translator',
        'website',
      ],
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
      ],
    },
    {
      label: 'Related Content',
      name: 'relatedContent',
      fields: [
        '_relatedBooks',
        '_relatedMedia',
        '_relatedPeople',
        '_relatedOrganizations',
      ],
    },
    ...MetaArrangement,
  ],

  construct: (self, options) => {
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
