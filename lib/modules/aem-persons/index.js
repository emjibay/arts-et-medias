const DescriptionField = require('../../fields/rich-text-description.json');
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
