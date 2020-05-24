const DescriptionField = require('../../fields/rich-text-description.json');
const HeroImageField = require('../../fields/hero-image.json');
const NameField = require('../../fields/name.json');
const WebsiteField = require('../../fields/website.json');

module.exports = {
  extend: 'apostrophe-pieces',
  name: 'media',
  label: 'Medium',
  pluralLabel: 'Medias',
  addFields: [
    {
      label: 'Type',
      help: 'Choose the medium type',
      name: 'type',
      type: 'select',
      required: true,
      choices: [
        {
          label: 'Blog',
          value: 'blog',
        },
        {
          label: 'Magazine',
          value: 'magazine',
        },
        {
          label: 'Website',
          value: 'website',
        },
        {
          label: 'Academic Paper',
          value: 'academicPaper',
        },
        {
          label: 'Conference Paper',
          value: 'conferencePaper',
        },
        {
          label: 'Journal',
          value: 'journal',
        },
      ]
    },
    ...DescriptionField,
    ...HeroImageField,
    ...NameField,
    ...WebsiteField,
  ],
  arrangeFields: [
    {
      label: 'Basics',
      name: 'basics',
      fields: [
        'title',
        'type',
        'heroImage',
        'description',
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

  construct: function(self, options) {
    const { apos } = self;

    self.on('apostrophe-pages:beforeSend', 'fetchAEMMedia', async function(req) {
      // alphabetically ordered
      req.data.mediaByTitle = await apos.docs.getManager('media').find(
        req,
        { type: 'media' }
      )
      .sort({ title: 1 }) // FIXME: sorting borks accented characters
      .toArray();

      // sorted by recently added
      req.data.mediaByMostRecent = await apos.docs.getManager('media').find(
        req,
        { type: 'media' }
      )
      .sort({ createdAt: -1 })
      .toArray();
    });
  },
};
