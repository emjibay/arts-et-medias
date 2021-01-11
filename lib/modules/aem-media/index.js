const sortAlphabetically = require('../../utils/sort-alphabetically');

const DescriptionField = require('../../fields/rich-text-description.json');
const HeroImageField = require('../../fields/hero-image.json');
const NameField = require('../../fields/name.json');
const RelatedPeople = require('../../fields/related-people.json');
const ShortDescriptionField = require('../../fields/optional-short-description.json');
const WebsiteField = require('../../fields/website.json');

const MetaArrangement = require('../../arrangements/meta.json');


const type = 'media';


module.exports = {
  extend: 'apostrophe-pieces',
  name: type,
  label: 'Medium',
  pluralLabel: 'Medias',
  addFields: [
    {
      label: 'Type',
      help: 'Choose the medium type',
      name: 'mediumType',
      type: 'select',
      required: true,
      choices: [
        {
          label: 'Blog',
          value: 'blog',
        },
        {
          label: 'Magazine',
          value: 'magazine',
        },
        {
          label: 'Website',
          value: 'website',
        },
      ],
    },

    // reverse relations
    {
      name: '_articlesWritten',
      reverseOf: '_originalAuthor',
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
      name: '_relatedArticles',
      reverseOf: '_relatedMedia',
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
      name: '_relatedBooks',
      reverseOf: '_relatedMedia',
      type: 'joinByArrayReverse',
      withType: 'book',
      filters: {
        projection: {
          '_url': 1,
          'title': 1,
        },
      },
    },

    ...DescriptionField,
    ...HeroImageField,
    ...NameField,
    ...RelatedPeople,
    ...ShortDescriptionField,
    ...WebsiteField,
  ],
  arrangeFields: [
    {
      label: 'Basics',
      name: 'basics',
      fields: [
        'title',
        'mediumType',
        'description',
        'website',
      ],
    },
    {
      label: 'Related Content',
      name: 'relatedContent',
      fields: [
        '_relatedPeople',
      ],
    },
    ...MetaArrangement,
  ],

  construct: (self, options) => {
    const { apos } = self;

    self.on('apostrophe-pages:beforeSend', 'fetchAEMMedia', async function(req) {
      // alphabetically ordered
      const mediaByTitle = await apos.docs.getManager(type)
        .find(req, { type })
        .toArray();
      mediaByTitle.sort(sortAlphabetically);
      req.data.mediaByTitle = mediaByTitle;

      // sorted by recently added
      req.data.mediaByMostRecent = await apos.docs.getManager(type)
        .find(req, { type })
        .sort({ createdAt: -1 })
        .toArray();
    });
  },
};
