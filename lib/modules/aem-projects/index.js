const DescriptionField = require('../../fields/rich-text-description.json');
const NameField = require('../../fields/name.json');
const RelatedPeople = require('../../fields/related-people.json');
const RelatedOrganizations = require('../../fields/related-organizations.json');
const WebsiteField = require('../../fields/website.json');
const YearPublishedField = require('../../fields/year-published.json');

module.exports = {
  extend: 'apostrophe-pieces',
  name: 'project',
  label: 'Project',
  pluralLabel: 'Projects',
  addFields: [
    {
      label: 'Hero image',
      help: '',
      name: 'heroImage',
      type: 'singleton',
      widgetType: 'apostrophe-images',
      required: false,
      options: {
        limit: 1,
      }
    },
    {
      label: 'Creator',
      help: 'Person or collective who created the project.',
      name: '_author',
      type: 'joinByArray',
      withType: [
        'person',
        'organization'
      ],
      filters: {
        permission: false,
        projection: {
          _url: 1,
          title: 1,
        }
      },
      required: true
    },
    ...DescriptionField,
    ...NameField,
    ...RelatedOrganizations,
    ...RelatedPeople,
    ...WebsiteField,
    ...YearPublishedField,
  ],
  arrangeFields: [
    {
      label: 'Basics',
      name: 'basics',
      fields: [
        'title',
        'heroImage',
        'description',
        '_author',
        'yearPublished',
        'website',
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
