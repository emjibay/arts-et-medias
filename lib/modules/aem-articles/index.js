const DescriptionField = require('../../fields/description.json');
const HeroImageField = require('../../fields/hero-image.json');

module.exports = {
  extend: 'apostrophe-pieces',
  name: 'article',
  label: 'Article',
  pluralLabel: 'Articles',
  addFields: [
    {
      label: 'Publication Date',
      help: '',
      name: 'publicationDate',
      type: 'date',
      required: true
    },
    {
      label: 'Type',
      help: 'Choose an article type',
      name: 'type',
      type: 'select',
      choices: [
        {
          label: 'Original',
          value: 'original',
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
    ...DescriptionField,
    ...HeroImageField,
  ],
  arrangeFields: [
    {
      label: 'Basics',
      name: 'basics',
      fields: [
        'title',
        'description',
        'publicationDate',
        'heroImage',
        'type',
        '_originalAuthor',
        'originalLang',
        '_translator',
        'externalLink',
      ]
    },
    {
      label: 'Meta',
      name: 'meta',
      fields: [
        'slug',
        'tags',
        'published',
        'trash'
      ]
    }
  ],
};
