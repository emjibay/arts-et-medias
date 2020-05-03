const CityField = require('../../fields/city.json');
const CountryCodeField = require('../../fields/country-code.json');
const DescriptionField = require('../../fields/description.json');
const NameField = require('../../fields/name.json');
const WebsiteField = require('../../fields/website.json');

module.exports = {
  extend: 'apostrophe-pieces',
  name: 'gallery',
  label: 'Gallery or Institution',
  pluralLabel: 'Galleries or Institutions',
  addFields: [
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
