const languageHelp = require('../../constants/language-codes-help');

const HeroImageField = require('../../fields/hero-image.json');
const RelatedEvents = require('../../fields/related-events.json');
const RelatedMedia = require('../../fields/related-media.json');
const RelatedOrganizations = require('../../fields/related-organizations.json');
const RelatedPeople = require('../../fields/related-people.json');
const ShortDescriptionField = require('../../fields/short-description.json');


module.exports = {
  extend: 'apostrophe-pieces',
  name: 'article',
  label: 'Article',
  pluralLabel: 'Articles',
  addFields: [
    // publication
    {
      label: 'Publication Date',
      help: 'The original date at which this article was written.',
      name: 'publicationDate',
      type: 'date',
      required: true,
    },

    // type
    {
      label: 'Type',
      htmlHelp: `<p>Choose an article type:</p>
      <p>— Original: the full article is published on Arts et Médias;</p>
      <p>— Mention: the article is published elsewhere, this is an abstract with a link to the original.</p>`,
      name: 'articleType',
      type: 'select',
      required: true,
      choices: [
        {
          label: 'Mention',
          value: 'mention',
        },
        {
          label: 'Original',
          value: 'original',
        },
      ],
    },

    // author
    {
      label: 'Original Author',
      help: '',
      name: '_originalAuthor',
      type: 'joinByArray',
      withType: [
        'person',
        'organization',
        'media',
      ],
      filters: {
        projection: {
          _url: 1,
          title: 1,
        },
      },
      required: true,
    },

    // lang
    {
      label: 'Is this text a translation?',
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
            '_translator',
          ],
        },
      ],
    },
    {
      label: 'Original Language',
      htmlHelp: '<p>The original language in which the article was written.</p>'
       + `${ languageHelp }`
       + '<p>Note: enter a value <u>only</u> if the language of the article differs from the language in which it is presented on <cite>Arts & Médias</cite>.</p>',
      name: 'originalLang',
      type: 'string',
    },
    {
      label: 'Translator',
      help: '',
      name: '_translator',
      type: 'joinByArray',
      withType: ['person' ],
      filters: {
        projection: {
          _url: 1,
          title: 1,
        },
      },
    },

    // external link
    {
      label: 'External Link',
      help: 'The full URL to the article. Use only if the full article is not published on Arts et Médias.',
      name: 'externalLink',
      type: 'string',
      required: false,
    },

    // related content
    {
      label: 'Related articles',
      help: '',
      name: '_relatedArticles',
      type: 'joinByArray',
      withType: 'article',
      filters: {
        projection: {
          '_url': 1,
          'title': 1,
        },
      },
    },
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
      reverseOf: '_relatedArticles',
      type: 'joinByArrayReverse',
      withType: 'article',
      filters: {
        projection: {
          '_url': 1,
          'title': 1,
        },
      },
    },

    ...HeroImageField,
    ...RelatedEvents,
    ...RelatedMedia,
    ...RelatedOrganizations,
    ...RelatedPeople,
    ...ShortDescriptionField,
  ],
  arrangeFields: [
    {
      label: 'Basics',
      name: 'basics',
      fields: [
        'title',
        'publicationDate',
        '_originalAuthor',
        'articleType',
        'shortDescription',
        'externalLink',
      ],
    },
    {
      label: 'Metadata',
      name: 'meta',
      fields: [
        'shortDescription',
        'tags',
      ],
    },
    {
      label: 'Hero Image',
      name: 'heroImage',
      fields: [
        'heroImage',
      ],
    },
    {
      label: 'Language',
      name: 'language',
      fields: [
        'originalLang',
        'isTranslation',
        '_translator',
      ],
    },
    {
      label: 'Related Content',
      name: 'relatedContent',
      fields: [
        '_relatedArticles',
        '_relatedBooks',
        '_relatedMedia',
        '_relatedEvents',
        '_relatedPeople',
        '_relatedOrganizations',
      ],
    },
    {
      label: 'CMS Properties',
      name: 'aposProps',
      fields: [
        'slug',
        'published',
        'trash',
      ],
    },
  ],

  construct: (self, options) => {
    const { apos } = self;

    self.on('apostrophe-pages:beforeSend', 'fetchAEMArticles', async function(req) {
      // sorted by pub date
      req.data.articlesByPublicationDate = await apos.docs.getManager('article').find(
        req,
        { type: 'article' }
      )
        .sort({ publicationDate: -1 })
        .toArray();

      // sorted by recently added
      req.data.articlesByMostRecent = await apos.docs.getManager('article').find(
        req,
        { type: 'article' }
      )
        .sort({ createdAt: -1 })
        .toArray();
    });
  },
};
