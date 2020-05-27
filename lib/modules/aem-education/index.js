const DescriptionField = require('../../fields/rich-text-description.json');
const HeroImageField = require('../../fields/hero-image.json');
const NameField = require('../../fields/name.json');
const WebsiteField = require('../../fields/website.json');

module.exports = {
  extend: 'apostrophe-pieces',
  name: 'education',
  label: 'Education or academic program',
  pluralLabel: 'Education or academic programs',
  addFields: [
    {
      label: 'Gallery or Institution',
      help: '',
      name: '_institution',
      type: 'joinByArray',
      withType: ['organization'],
      filters: {
        projection: {
          _url: 1,
          title: 1,
          city: 1,
          country: 1
        }
      },
      required: true,
      limit: 1,
    },
    {
      label: 'Language',
      help: 'The language in which the program/workshop is given. Two-letter language ISO code (e.g. EN, FR) as described in the ISO 639-1 international standard.',
      name: 'lang',
      type: 'string',
      required: true
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
        'description',
        'lang',
        '_institution',
        'website',
      ]
    },
    {
      label: 'Meta',
      name: 'meta',
      fields: [
        'heroImage',
        'tags',
        'slug',
        'published',
        'trash',
      ]
    }
  ],

  construct: function(self, options) {
    const { apos } = self;

    self.on('apostrophe-pages:beforeSend', 'fetchAEMEducation', async function(req) {
      // alphabetically ordered
      req.data.educationByTitle = await apos.docs.getManager('education').find(
        req,
        { type: 'education' }
      )
      .sort({ title: 1 }) // FIXME: sorting borks accented characters
      .toArray();

      // sorted by recently added
      req.data.educationByMostRecent = await apos.docs.getManager('education').find(
        req,
        { type: 'education' }
      )
      .sort({ createdAt: -1 })
      .toArray();
    });
  },
};
