const getSearchProps = require('../../utils/get-search-props');
const sortAlphabetically = require('../../utils/sort-alphabetically');

const DescriptionField = require('../../fields/rich-text-description.json');
const ShortDescriptionField = require('../../fields/optional-short-description.json');
const WebsiteField = require('../../fields/website.json');


const type = 'person';


module.exports = {
  extend: 'apostrophe-pieces',
  name: type,
  label: 'Person',
  pluralLabel: 'People',
  addFields: [
    // basics
    {
      label: 'Display Name',
      help: 'The complete name to display. This could also be a nickname.',
      name: 'title', // override apos'
      type: 'string',
      required: true,
    },
    {
      label: 'First Name',
      help: 'Ensure to fill this field for authors and writers.',
      name: 'firstName',
      type: 'string',
      required: false,
    },
    {
      label: 'Last Name',
      help: 'Ensure to fill this field for authors and writers.',
      name: 'lastName',
      type: 'string',
      required: false,
    },
    {
      label: 'Is Private?',
      name: 'isPrivate',
      type: 'boolean',
    },

    // reverse relations
    {
      name: '_projects',
      idsField: 'creatorIds',
      type: 'joinByArrayReverse',
      withType: 'project',
      filters: {
        projection: {
          _url: 1,
          title: 1,
        },
      },
    },
    {
      name: '_articles',
      reverseOf: '_originalAuthor',
      type: 'joinByArrayReverse',
      withType: 'article',
      filters: {
        projection: {
          _url: 1,
          title: 1,
          isPrivate: 1,
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
          isPrivate: 1,
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
          isPrivate: 1,
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
          isPrivate: 1,
        },
      },
    },
    {
      name: '_booksEdited',
      reverseOf: '_editor',
      type: 'joinByArrayReverse',
      withType: 'book',
      filters: {
        projection: {
          _url: 1,
          title: 1,
          isPrivate: 1,
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
          isPrivate: 1,
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
          isPrivate: 1,
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
          isPrivate: 1,
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
          isPrivate: 1,
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
          isPrivate: 1,
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
          isPrivate: 1,
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
          isPrivate: 1,
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
        'isPrivate',
      ],
    },
    {
      label: 'Description',
      name: 'description',
      fields: [
        'shortDescription',
        'description',
        'tags',
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

    self.on('apostrophe-pages:beforeSend', 'fetchAEMPeople', async function(req) {
      const searchProps = getSearchProps(
        req,
        {
          props: { type },
        }
      );

      // sorted by title
      const peopleByTitle = await apos.docs.getManager(type)
        .find(req, searchProps)
        .toArray();
      peopleByTitle.sort(sortAlphabetically);
      req.data.peopleByTitle = peopleByTitle;

      // sorted by recently added
      const peopleByMostRecent = await apos.docs.getManager(type)
        .find(req, searchProps)
        .sort({ createdAt: -1 })
        .toArray();
      req.data.peopleByMostRecent = peopleByMostRecent;
    });
  },
};
