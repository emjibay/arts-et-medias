const copyField = require('../../utils/copy-field');
const log = require('../../utils/log');
const sortAlphabetically = require('../../utils/sort-alphabetically');
const toJsonCsl = require('../../utils/to-book-json-csl');

const citationService = require('../../services/citation-service');

const countryCodeHelp = require('../../constants/country-codes-help');
const languageHelp = require('../../constants/language-codes-help');

const DescriptionField = require('../../fields/rich-text-description.json');
const HeroImageField = require('../../fields/hero-image.json');
const PersonField = require('../../fields/author.json');
const RelatedMedia = require('../../fields/related-media.json');
const RelatedOrganizations = require('../../fields/related-organizations.json');
const RelatedPeople = require('../../fields/related-people.json');
const ShortDescriptionField = require('../../fields/optional-short-description.json');
const WebsiteField = require('../../fields/website.json');
const YearPublishedField = require('../../fields/year-published.json');

const MetaArrangement = require('../../arrangements/meta-no-image.json');


const AuthorField = copyField(
  PersonField,
  {
    help: 'This field should be mandatory. The only reason this field should be left empty is if there are editors added below.',
    required: false,
  }
);

const EditorField = copyField(
  PersonField,
  {
    name: '_editor',
    label: 'Editor',
    required: false,
  }
);

const ContributorField = copyField(
  PersonField,
  {
    name: '_contributor',
    label: 'Contributor',
    required: false,
  }
);

const TranslatorField = copyField(
  PersonField,
  {
    name: '_translator',
    label: 'Translator',
    htmlHelp: `<p>This field is not mandatory.
    <p>However, it <u>must</u> be filled if your select "Yes" when asked for whether or not this work is a translation.</p>
    <p>This field is optional to cover the case of multilingual books, where the work is not a translation per se, but there might be a translator involved.</p>`,
    required: false,
  }
);

const type = 'book';


module.exports = {
  extend: 'apostrophe-pieces',
  name: type,
  label: 'Book',
  pluralLabel: 'Books',
  addFields: [
    {
      label: 'Subtitle',
      help: '',
      name: 'subtitle',
      type: 'string',
      required: false,
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
        },
        {
          label: 'Yes',
          value: true,
          showFields: [
            'originalLang',
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
      name: '_articles',
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
    ...EditorField,
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
        'subtitle',
        'description',
        'website',
      ],
    },

    // people
    {
      label: 'Authors, Editors, etc.',
      name: 'authors',
      fields: [
        '_author',
        '_editor',
        '_contributor',
        '_translator',
        'isTranslation',
        'lang',
        'originalLang',
      ],
    },

    // hero image
    {
      label: 'Hero Image',
      name: 'heroImage',
      fields: [
        'heroImage',
      ],
    },

    // publisher
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

    // related content
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
      const booksByTitle = await apos.docs.getManager(type)
        .find(req, { type })
        .toArray();
      booksByTitle.sort(sortAlphabetically);
      req.data.booksByTitle = booksByTitle;

      // sorted by recently added
      req.data.booksByMostRecent = await apos.docs.getManager(type)
        .find(req, { type })
        .sort({ createdAt: -1 })
        .toArray();
    });

    self.on('apostrophe-docs:beforeSave', 'updateCitation', async function(req, piece) {
      // ensure piece
      if (!piece) {
        log.warning('Unable to update citations, no piece found.');
        return;
      }

      // ensure doc type
      if (piece.type !== type) {
        log.warning('Unable to update citations, piece is not a book.');
        return;
      }

      // create csl
      const locale = req.getLocale().substr(0, 2);
      const csl = toJsonCsl(piece, { locale });

      // fetch citations
      const apa = await citationService.getAPA(csl, locale);
      const bibtex = await citationService.getBibTex(csl, locale);
      const chicago = await citationService.getChicago(csl, locale);
      const mla = await citationService.getMLA(csl, locale);

      piece.citations = { apa, bibtex, chicago, mla };
    });
  },
};
