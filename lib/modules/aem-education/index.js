const sortAlphabetically = require('../../utils/sort-alphabetically');

const languageHelp = require('../../constants/language-codes-help');

const DescriptionField = require('../../fields/rich-text-description.json');
const HeroImageField = require('../../fields/hero-image.json');
const NameField = require('../../fields/name.json');
const RelatedPeople = require('../../fields/related-people.json');
const ShortDescriptionField = require('../../fields/optional-short-description.json');
const WebsiteField = require('../../fields/website.json');

const MetaArrangement = require('../../arrangements/meta.json');


const type = 'education';


module.exports = {
  extend: 'apostrophe-pieces',
  name: type,
  label: 'Academic program',
  pluralLabel: 'Academic programs',
  addFields: [
    {
      label: 'Institution',
      help: '',
      name: '_institution',
      type: 'joinByArray',
      withType: ['organization' ],
      filters: {
        projection: {
          _url: 1,
          title: 1,
          city: 1,
          country: 1,
        },
      },
      required: true,
      limit: 1,
    },
    {
      label: 'Language',
      htmlHelp: `The language in which the program is given. ${languageHelp}`,
      name: 'lang',
      type: 'string',
      required: true,
    },
    ...DescriptionField,
    ...HeroImageField,
    ...NameField,
    ...RelatedPeople,
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
      ],
    },
    {
      label: 'Related Content',
      name: 'relatedContent',
      fields: [
        '_relatedPeople',
      ],
    },
    ...MetaArrangement,
  ],

  construct: (self, options) => {
    const { apos } = self;

    self.on('apostrophe-pages:beforeSend', 'fetchAEMEducation', async function(req) {
      // alphabetically ordered
      const educationByTitle = await apos.docs.getManager(type)
        .find(req, { type })
        .toArray();
      educationByTitle.sort(sortAlphabetically);
      req.data.educationByTitle = educationByTitle;

      // sorted by recently added
      req.data.educationByMostRecent = await apos.docs.getManager(type)
        .find(req, { type })
        .sort({ createdAt: -1 })
        .toArray();
    });
  },
};
