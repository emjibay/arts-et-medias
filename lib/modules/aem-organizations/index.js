const sortAlphabetically = require('../../utils/sort-alphabetically');

const CityField = require('../../fields/city.json');
const CountryCodeField = require('../../fields/country-code.json');
const DescriptionField = require('../../fields/rich-text-description.json');
const HeroImageField = require('../../fields/hero-image.json');
const NameField = require('../../fields/name.json');
const RelatedOrganizations = require('../../fields/related-organizations.json');
const RelatedPeople = require('../../fields/related-people.json');
const ShortDescriptionField = require('../../fields/optional-short-description.json');
const WebsiteField = require('../../fields/website.json');

const MetaArrangement = require('../../arrangements/meta.json');


const type = 'organization';


module.exports = {
  extend: 'apostrophe-pieces',
  name: type,
  label: 'Organization',
  pluralLabel: 'Organizations',
  addFields: [
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
      reverseOf: '_relatedOrganizations',
      type: 'joinByArrayReverse',
      withType: 'article',
      filters: {
        projection: {
          '_url': 1,
          'title': 1,
        },
      },
    },
    {
      name: '_articlesWritten',
      reverseOf: '_originalAuthor',
      type: 'joinByArrayReverse',
      withType: 'article',
      filters: {
        projection: {
          '_url': 1,
          'title': 1,
        },
      },
    },
    {
      name: '_books',
      reverseOf: '_relatedOrganizations',
      type: 'joinByArrayReverse',
      withType: 'book',
      filters: {
        projection: {
          '_url': 1,
          'title': 1,
        },
      },
    },
    {
      name: '_organizations',
      reverseOf: '_relatedOrganizations',
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
      name: '_academicPrograms',
      reverseOf: '_institution',
      type: 'joinByArrayReverse',
      withType: 'education',
      filters: {
        projection: {
          _url: 1,
          title: 1,
        },
      },
    },
    {
      name: '_programsMentioned',
      reverseOf: '_relatedOrganizations',
      type: 'joinByArrayReverse',
      withType: 'education',
      filters: {
        projection: {
          '_url': 1,
          'title': 1,
        },
      },
    },

    ...CityField,
    ...CountryCodeField,
    ...DescriptionField,
    ...HeroImageField,
    ...NameField,
    ...RelatedPeople,
    ...RelatedOrganizations,
    ...ShortDescriptionField,
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
      ],
    },
    {
      label: 'Related Content',
      name: 'relatedContent',
      fields: [
        '_relatedPeople',
        '_relatedOrganizations',
      ],
    },
    ...MetaArrangement,
  ],

  construct: (self, options) => {
    const { apos } = self;

    self.on('apostrophe-pages:beforeSend', 'fetchAEMOrganizations', async function(req) {
      // alphabetically ordered
      const organizationsByTitle = await apos.docs.getManager(type)
        .find(req, { type })
        .toArray();
      organizationsByTitle.sort(sortAlphabetically);
      req.data.organizationsByTitle = organizationsByTitle;

      // sorted by recently added
      req.data.organizationsByMostRecent = await apos.docs.getManager(type)
        .find(req, { type })
        .sort({ createdAt: -1 })
        .toArray();
    });
  },
};
