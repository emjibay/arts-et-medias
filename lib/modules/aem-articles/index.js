const languageHelp = require('../../constants/language-codes-help');

const HeroImageField = require('../../fields/hero-image.json');
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
    {
      label: 'Publication Date',
      help: 'The original date at which this article was written.',
      name: 'publicationDate',
      type: 'date',
      required: true
    },
    {
      label: 'Type',
      help: 'Choose an article type',
      name: 'articleType',
      type: 'select',
      required: true,
      choices: [
        {
          label: 'Original',
          value: 'original',
          showFields: [
            '_originalAuthor',
          ]
        },
        {
          label: 'Mention',
          value: 'mention',
          showFields: [
            '_originalAuthor',
            'externalLink',
          ]
        },
        {
          label: 'Translation',
          value: 'translation',
          showFields: [
            '_originalAuthor',
            'originalLang',
            '_translator',
            'externalLink',
          ]
        },
      ]
    },
    {
      label: 'Original Author',
      help: '',
      name: '_originalAuthor',
      type: 'joinByArray',
      withType: [
        'person',
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
    {
      label: 'Original Language',
      htmlHelp: `The original language in which the article was written. ${languageHelp}`,
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
        permission: false,
        projection: {
          _url: 1,
          title: 1
        }
      },
      required: true
    },
    {
      label: 'External Link',
      help: 'The target URL',
      name: 'externalLink',
      type: 'string',
      required: false
    },

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
      name: '_articles',
      type: 'joinByArrayReverse',
      withType: 'article',
      reverseOf: '_relatedArticles',
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
        '_relatedMedia',
        '_relatedPeople',
        '_relatedOrganizations',
      ]
    },
    {
      label: 'Meta',
      name: 'meta',
      fields: [
        'shortDescription',
        'tags',
        'slug',
        'published',
        'trash'
      ]
    }
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
