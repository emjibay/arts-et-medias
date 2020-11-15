// const asyncForEach = require('../../utils/async-for-each');
const copyField = require('../../utils/copy-field');
// const toJsonCsl = require('../../utils/to-json-csl');

// const citationService = require('../../services/citation-service');

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

const MetaArrangement = require('../../arrangements/meta-no-image.json');


module.exports = {
  extend: 'apostrophe-pieces',
  name: 'book',
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
      // FIXME: citations slow down site
      /*
      const bookDocuments = await apos.docs.getManager('book').find(
        req,
        { type: 'book' }
      ).toArray();

      const locale = req.getLocale();

      const citations = [];
      await asyncForEach(
        bookDocuments,
        async doc => {
          const csl = toJsonCsl(doc, { locale });
          citations.push({
            _id: doc._id,
            apa: await citationService.getAPA(csl, locale),
            bibtex: await citationService.getBibTex(csl, locale),
            chicago: await citationService.getChicago(csl, locale),
            mla: await citationService.getMLA(csl, locale),
          });
        }
      );
      req.data.bookCitations = citations;
      */

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
