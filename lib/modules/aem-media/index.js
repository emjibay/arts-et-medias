const DescriptionField = require('../../fields/rich-text-description.json');
const HeroImageField = require('../../fields/hero-image.json');
const NameField = require('../../fields/name.json');
const ShortDescriptionField = require('../../fields/optional-short-description.json');
const WebsiteField = require('../../fields/website.json');

const MetaArrangement = require('../../arrangements/meta.json');


module.exports = {
  extend: 'apostrophe-pieces',
  name: 'media',
  label: 'Medium',
  pluralLabel: 'Medias',
  addFields: [
    {
      label: 'Type',
      help: 'Choose the medium type',
      name: 'mediumType',
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
      ]
    },
    ...DescriptionField,
    ...HeroImageField,
    ...NameField,
    ...ShortDescriptionField,
    ...WebsiteField,
  ],
  arrangeFields: [
    {
      label: 'Basics',
      name: 'basics',
      fields: [
        'title',
        'mediumType',
        'description',
        'website',
      ]
    },
    ...MetaArrangement
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
