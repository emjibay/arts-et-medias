const CityField = require('../../fields/city.json');
const CountryCodeField = require('../../fields/country-code.json');
const DescriptionField = require('../../fields/rich-text-description.json');
const HeroImageField = require('../../fields/hero-image.json');
const NameField = require('../../fields/name.json');
const RelatedPeople = require('../../fields/related-people.json');
const WebsiteField = require('../../fields/website.json');

module.exports = {
  extend: 'apostrophe-pieces',
  name: 'organization',
  label: 'Organization',
  pluralLabel: 'Organizations',
  addFields: [
    ...CityField,
    ...CountryCodeField,
    ...DescriptionField,
    ...HeroImageField,
    ...NameField,
    ...RelatedPeople,
    ...WebsiteField,
  ],
  arrangeFields: [
    {
      label: 'Basics',
      name: 'basics',
      fields: [
        'title',
        'heroImage',
        'description',
        'city',
        'country',
        'website',
      ]
    },
    {
      label: 'Related Content',
      name: 'relatedContent',
      fields: [
        '_relatedPeople',
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

  construct: function(self, options) {
    const { apos } = self;

    self.on('apostrophe-pages:beforeSend', 'fetchAEMOrganizations', async function(req) {
      req.data.organizationsByTitle = await apos.docs.getManager('organization').find(
        req,
        { type: 'organization' }
      )
      .sort({ title: 1 }) // FIXME: sorting borks accented characters
      .toArray();
    });
  },
};
