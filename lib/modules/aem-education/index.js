const DescriptionField = require('../../fields/rich-text-description.json');
const NameField = require('../../fields/name.json');
const WebsiteField = require('../../fields/website.json');

module.exports = {
  extend: 'apostrophe-pieces',
  name: 'education',
  label: 'Education, program, or workshop',
  pluralLabel: 'Education, programs, or workshops',
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
        '_institution',
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

    self.on('apostrophe-pages:beforeSend', 'fetchAEMEducation', async function(req) {
      req.data.educationByTitle = await apos.docs.getManager('education').find(
        req,
        { type: 'education' }
      )
      .sort({ title: 1 }) // FIXME: sorting borks accented characters
      .toArray();
    });
  },
};
