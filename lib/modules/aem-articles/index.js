const DescriptionField = require('../../fields/description.json');
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
      withType: ['person'],
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
      help: 'Two-letter language ISO code (e.g. EN, FR) as described in the ISO 639-1 international standard.',
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
        '_relatedPeople',
        '_relatedOrganizations',
        '_relatedMedia',
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
      req.data.articlesByMostRecent = await apos.docs.getManager('article').find(
        req,
        { type: 'article' }
      )
      .sort({ publicationDate: -1 })
      .toArray();
    });
  }
};
