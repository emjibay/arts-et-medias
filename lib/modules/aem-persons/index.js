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
    // FIXME: collides with books'
    // {
    //   name: '_author',
    //   type: 'joinByArrayReverse',
    //   withType: 'project',
    //   filters: {
    //     projection: {
    //       _url: 1,
    //       title: 1,
    //       tags: 1
    //     }
    //   },
    // },
    {
      name: '_originalAuthor',
      type: 'joinByArrayReverse',
      withType: 'article',
      filters: {
        projection: {
          _url: 1,
          title: 1,
          tags: 1
        }
      },
    },
    {
      name: '_author',
      type: 'joinByArrayReverse',
      withType: 'book',
      filters: {
        projection: {
          _url: 1,
          title: 1,
          tags: 1
        }
      },
    },
    {
      name: '_relatedPeople',
      // name: '_relatedOrgs',
      // reverseOf: '_relatedPeople',
      // idsField: 'peopleRelatedToOrgsIds',
      type: 'joinByArrayReverse',
      withType: 'organization',
      filters: {
        projection: {
          _url: 1,
          title: 1,
          tags: 1
        }
      },
    },
    // FIXME: collides with organizations'
    {
      name: '_relatedEvents',
      reverseOf: '_relatedPeople',
      idsField: 'peopleRelatedToEventsIds',
      type: 'joinByArrayReverse',
      withType: 'event',
      filters: {
        projection: {
          _url: 1,
          title: 1,
          tags: 1
        }
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
        'profilePic',
        'firstName',
        'lastName',
        'description',
        'website',
      ]
    },
    ...MetaArrangement
  ],

  construct: function(self, options) {
    const { apos } = self;

    self.on('apostrophe-pages:beforeSend', 'fetchAEMPeople', async function(req) {
      req.data.peopleByTitle = await apos.docs.getManager('person').find(
        req,
        { type: 'person' }
      )
      .sort({ title: 1 }) // FIXME: sorting borks accented characters
      .toArray();
    });
  },
};
