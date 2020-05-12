const DescriptionField = require('../../fields/description.json');
const WebsiteField = require('../../fields/website.json');

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
    {
      label: 'Description',
      help: '',
      name: 'description',
      type: 'area',
      options: {
        limit: 1,
        widgets: {
          'apostrophe-rich-text': {
            toolbar: ['Bold', 'Italic', 'Link', 'Unlink'],
            truncate: 140,
          }
        }
      },
      required: true
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

    // ...DescriptionField,
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
    {
      label: 'Meta',
      name: 'meta',
      fields: [
        'tags',
        'slug',
        'published',
        'trash',
      ]
    }
  ],
};
