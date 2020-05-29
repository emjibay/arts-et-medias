const DescriptionField = require('../../fields/rich-text-description.json');
const HeroImageField = require('../../fields/hero-image.json');
const NameField = require('../../fields/name.json');
const RelatedOrganizations = require('../../fields/related-organizations.json');
const RelatedPeople = require('../../fields/related-people.json');
const ShortDescriptionField = require('../../fields/short-description.json');
const WebsiteField = require('../../fields/website.json');
const YearPublishedField = require('../../fields/year-published.json');


module.exports = {
  extend: 'apostrophe-pieces',
  name: 'project',
  label: 'Project',
  pluralLabel: 'Projects',
  addFields: [
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
    ...HeroImageField,
    ...NameField,
    ...RelatedOrganizations,
    ...RelatedPeople,
    ...ShortDescriptionField,
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
        'heroImage',
        'shortDescription',
        'tags',
        'slug',
        'published',
        'trash',
      ]
    }
  ],

  construct: function(self, options) {
    const { apos } = self;

    self.on('apostrophe-pages:beforeSend', 'fetchAEMProjects', async function(req) {
      // sorted by title
      req.data.projectsByTitle = await apos.docs.getManager('project').find(
        req,
        { type: 'project' }
      )
      .sort({ title: 1 }) // FIXME: sorting borks accented characters
      .toArray();

      // sorted recent to old
      req.data.projectsByMostRecent = await apos.docs.getManager('project').find(
        req,
        { type: 'project' }
      )
      .sort({ createdAt: -1 })
      .toArray();
    });
  },
};
