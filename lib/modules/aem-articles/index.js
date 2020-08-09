const languageHelp = require('../../constants/language-codes-help');

const HeroImageField = require('../../fields/hero-image.json');
const RelatedMedia = require('../../fields/related-media.json');
const RelatedOrganizations = require('../../fields/related-organizations.json');
const RelatedPeople = require('../../fields/related-people.json');
const ShortDescriptionField = require('../../fields/short-description.json');

const MetaArrangement = require('../../arrangements/meta-no-image.json');


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
      required: true
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
          label: 'Original',
          value: 'original',
        },
        {
          label: 'Mention',
          value: 'mention',
        },
      ]
    },

    // author
    {
      label: 'Original Author',
      help: '',
      name: '_originalAuthor',
      type: 'joinByArray',
      withType: [
        'person',
        'media',
        'organization'
      ],
      filters: {
        projection: {
          _url: 1,
          title: 1
        }
      },
      required: true
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
            'originalLang',
            '_translator',
          ]
        },
      ]
    },
    {
      label: 'Original Language',
      htmlHelp: `The original language in which the article was written. ${ languageHelp }`,
      name: 'originalLang',
      type: 'string',
      required: true
    },
    {
      label: 'Translator',
      help: '',
      name: '_translator',
      type: 'joinByArray',
      withType: ['person'],
      filters: {
        projection: {
          _url: 1,
          title: 1
        }
      },
      required: true
    },

    // external link
    {
      label: 'External Link',
      help: 'The full URL to the article. Use only if the full article is not published on Arts et Médias.',
      name: 'externalLink',
      type: 'string',
      required: false
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
        }
      }
    },
    {
      label: 'Related books',
      help: '',
      name: '_relatedBooks',
      type: 'joinByArray',
      withType: ['book'],
      filters: {
        projection: {
          '_url': 1,
          'title': 1,
        }
      }
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
        }
      }
    },

    ...HeroImageField,
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
        'heroImage',
        'articleType',
        '_originalAuthor',
        'isTranslation',
        'originalLang',
        '_translator',
        'externalLink',
      ]
    },
    {
      label: 'Related Content',
      name: 'relatedContent',
      fields: [
        '_relatedArticles',
        '_relatedBooks',
        '_relatedMedia',
        '_relatedPeople',
        '_relatedOrganizations',
      ]
    },
    ...MetaArrangement
  ],

  construct: function(self, options) {
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
  }
};
