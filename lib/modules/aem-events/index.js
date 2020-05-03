const CityField = require('../../fields/city.json');
const CountryCodeField = require('../../fields/country-code.json');
const DescriptionField = require('../../fields/description.json');
const NameField = require('../../fields/name.json');
const WebsiteField = require('../../fields/website.json');

module.exports = {
  extend: 'apostrophe-pieces',
  name: 'event',
  label: 'Event',
  pluralLabel: 'Events',
  addFields: [
    {
      label: 'Start Date',
      help: '',
      name: 'startDate',
      type: 'date',
      required: true
    },
    {
      label: 'End Date',
      help: '',
      name: 'endDate',
      type: 'date',
      required: true
    },
    {
      label: 'Related People',
      help: '',
      name: '_relatedPeople',
      type: 'joinByArray',
      withType: ['person'],
      filters: {
        projection: {
          _url: 1,
          title: 1
        }
      },
    },
    {
      label: 'Related Galleries or Institutions',
      help: '',
      name: '_relatedGalleries',
      type: 'joinByArray',
      withType: ['gallery'],
      filters: {
        projection: {
          _url: 1,
          title: 1
        }
      },
    },

    ...CityField,
    ...CountryCodeField,
    ...DescriptionField,
    ...NameField,
    ...WebsiteField,
  ],
  arrangeFields: [
    {
      label: 'Basics',
      name: 'basics',
      fields: [
        'title',
        'description',
        'city',
        'country',
        'website',
      ]
    },
    {
      label: 'Calendar',
      name: 'calendar',
      fields: [
        'startDate',
        'endDate',
      ]
    },
    {
      label: 'Related Content',
      name: 'relatedContent',
      fields: [
        '_relatedPeople',
        '_relatedGalleries',
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
