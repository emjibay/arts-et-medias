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
