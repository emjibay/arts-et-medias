const languageHelp = require('../../constants/language-codes-help');

const DescriptionField = require('../../fields/rich-text-description.json');
const HeroImageField = require('../../fields/hero-image.json');
const NameField = require('../../fields/name.json');
const ShortDescriptionField = require('../../fields/optional-short-description.json');
const WebsiteField = require('../../fields/website.json');

const MetaArrangement = require('../../arrangements/meta.json');


module.exports = {
  extend: 'apostrophe-pieces',
  name: 'education',
  label: 'Academic program',
  pluralLabel: 'Academic programs',
  addFields: [
    {
      label: 'Institution',
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
      htmlHelp: `The language in which the program is given. ${languageHelp}`,
      name: 'lang',
      type: 'string',
      required: true
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
        'description',
        'lang',
        '_institution',
        'website',
      ]
    },
    ...MetaArrangement
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
