const CityField = require('../../fields/city.json');
const CountryCodeField = require('../../fields/country-code.json');
const DescriptionField = require('../../fields/rich-text-description.json');
const NameField = require('../../fields/name.json');
const RelatedOrganizations = require('../../fields/related-organizations.json');
const RelatedPeople = require('../../fields/related-people.json');
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
    ...CityField,
    ...CountryCodeField,
    ...DescriptionField,
    ...NameField,
    ...RelatedOrganizations,
    ...RelatedPeople,
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
        '_relatedOrganizations',
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
