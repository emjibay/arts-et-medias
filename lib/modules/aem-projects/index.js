const AuthorField = require('../../fields/author.json');
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
    ...AuthorField,
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
