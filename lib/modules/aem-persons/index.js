const DescriptionField = require('../../fields/rich-text-description.json');
const ShortDescriptionField = require('../../fields/optional-short-description.json');
const WebsiteField = require('../../fields/website.json');

const MetaArrangement = require('../../arrangements/meta-no-image.json');


module.exports = {
  extend: 'apostrophe-pieces',
  name: 'person',
  label: 'Person',
  pluralLabel: 'People',
  addFields: [
    // basics
    {
      label: 'Display Name',
      help: '',
      name: 'title', // override apos'
      type: 'string',
      required: true,
    },
    {
      label: 'First Name',
      help: '',
      name: 'firstName',
      type: 'string',
      required: false,
    },
    {
      label: 'Last Name',
      help: '',
      name: 'lastName',
      type: 'string',
      required: false,
    },

    // reverse relations
    // FIXME: "I think you forgot to set idField or idsField, or you set the wrong one (use idField for byOne, idsField for byArray"
    // {
    //   name: '_projects',
    //   reverseOf: '_author',
    //   type: 'joinByArrayReverse',
    //   withType: 'project',
    //   filters: {
    //     projection: {
    //       _url: 1,
    //       title: 1
    //     }
    //   },
    // },
    {
      name: '_articles',
      reverseOf: '_originalAuthor',
      type: 'joinByArrayReverse',
      withType: 'article',
      filters: {
        projection: {
          _url: 1,
          title: 1,
        },
      },
    },
    {
      name: '_articlesTranslated',
      reverseOf: '_translator',
      type: 'joinByArrayReverse',
      withType: 'article',
      filters: {
        projection: {
          _url: 1,
          title: 1,
        },
      },
    },
    {
      name: '_articlesMentioned',
      reverseOf: '_relatedPeople',
      type: 'joinByArrayReverse',
      withType: 'article',
      filters: {
        projection: {
          _url: 1,
          title: 1,
        },
      },
    },
    {
      name: '_books',
      reverseOf: '_author',
      type: 'joinByArrayReverse',
      withType: 'book',
      filters: {
        projection: {
          _url: 1,
          title: 1,
        },
      },
    },
    {
      name: '_booksContributed',
      reverseOf: '_contributor',
      type: 'joinByArrayReverse',
      withType: 'book',
      filters: {
        projection: {
          _url: 1,
          title: 1,
        },
      },
    },
    {
      name: '_booksMentioned',
      reverseOf: '_relatedPeople',
      type: 'joinByArrayReverse',
      withType: 'book',
      filters: {
        projection: {
          _url: 1,
          title: 1,
        },
      },
    },
    {
      name: '_booksTranslated',
      reverseOf: '_translator',
      type: 'joinByArrayReverse',
      withType: 'book',
      filters: {
        projection: {
          _url: 1,
          title: 1,
        },
      },
    },
    {
      name: '_organizations',
      reverseOf: '_relatedPeople',
      type: 'joinByArrayReverse',
      withType: 'organization',
      filters: {
        projection: {
          _url: 1,
          title: 1,
        },
      },
    },
    {
      name: '_medias',
      reverseOf: '_relatedPeople',
      type: 'joinByArrayReverse',
      withType: 'media',
      filters: {
        projection: {
          _url: 1,
          title: 1,
        },
      },
    },
    {
      name: '_events',
      reverseOf: '_relatedPeople',
      type: 'joinByArrayReverse',
      withType: 'event',
      filters: {
        projection: {
          _url: 1,
          title: 1,
        },
      },
    },
    {
      name: '_educations',
      reverseOf: '_relatedPeople',
      type: 'joinByArrayReverse',
      withType: 'education',
      filters: {
        projection: {
          _url: 1,
          title: 1,
        },
      },
    },

    // meta
    {
      label: 'Profile Picture',
      help: '',
      name: 'profilePic',
      type: 'singleton',
      widgetType: 'apostrophe-images',
      required: false,
    },

    ...DescriptionField,
    ...ShortDescriptionField,
    ...WebsiteField,
  ],
  arrangeFields: [
    {
      label: 'Basics',
      name: 'basics',
      fields: [
        'title',
        'firstName',
        'lastName',
        'website',
      ],
    },
    {
      label: 'Picture',
      name: 'profilePic',
      fields: [
        'profilePic',
      ],
    },
    {
      label: 'Description',
      name: 'description',
      fields: [
        'shortDescription',
        'description',
        'tags',
      ]
    },
    {
      label: 'CMS Properties',
      name: 'aposProps',
      fields: [
        'slug',
        'published',
        'trash',
      ]
    },
  ],

  construct: (self, options) => {
    const { apos } = self;

    self.on('apostrophe-pages:beforeSend', 'fetchAEMPeople', async function(req) {
      // sorted by title
      req.data.peopleByTitle = await apos.docs.getManager('person').find(
        req,
        { type: 'person' }
      )
        .sort({ title: 1 }) // FIXME: sorting borks accented characters
        .toArray();

      // sorted by recently added
      req.data.peopleByMostRecent = await apos.docs.getManager('person').find(
        req,
        { type: 'person' }
      )
        .sort({ createdAt: -1 })
        .toArray();
    });
  },
};
