const CityField = require('../../fields/city.json');
const CountryCodeField = require('../../fields/country-code.json');
const DescriptionField = require('../../fields/description.json');
const NameField = require('../../fields/name.json');
const WebsiteField = require('../../fields/website.json');

module.exports = {
  extend: 'apostrophe-pieces',
  name: 'education',
  label: 'Education, program, or workshop',
  pluralLabel: 'Education, programs, or workshops',
  addFields: [
    {
      label: 'Institution',
      help: '',
      name: 'institution',
      type: 'string',
      required: true,
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
        'website',
      ]
    },
    {
      label: 'Institution',
      name: 'institution',
      fields: [
        'institution',
        'city',
        'country',
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
