const moment = require('moment');

const CityField = require('../../fields/city.json');
const CountryCodeField = require('../../fields/country-code.json');
const DescriptionField = require('../../fields/rich-text-description.json');
const HeroImageField = require('../../fields/hero-image.json');
const NameField = require('../../fields/name.json');
const RelatedOrganizations = require('../../fields/related-organizations.json');
const RelatedPeople = require('../../fields/related-people.json');
const ShortDescriptionField = require('../../fields/optional-short-description.json');
const WebsiteField = require('../../fields/website.json');

const MetaArrangement = require('../../arrangements/meta.json');


module.exports = {
  extend: 'apostrophe-pieces',
  name: 'event',
  label: 'Event',
  pluralLabel: 'Events',
  addFields: [
    {
      label: 'Start Date',
      help: '',
      name: 'startDate',
      type: 'date',
      required: true,
    },
    {
      label: 'End Date',
      help: '',
      name: 'endDate',
      type: 'date',
    },
    ...CityField,
    ...CountryCodeField,
    ...DescriptionField,
    ...HeroImageField,
    ...NameField,
    ...RelatedOrganizations,
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
        'city',
        'country',
        'website',
      ],
    },
    {
      label: 'Calendar',
      name: 'calendar',
      fields: [
        'startDate',
        'endDate',
      ],
    },
    {
      label: 'Related Content',
      name: 'relatedContent',
      fields: [
        '_relatedPeople',
        '_relatedOrganizations',
      ],
    },
    ...MetaArrangement,
  ],

  construct: (self) => {
    const { apos } = self;

    self.on('apostrophe-pages:beforeSend', 'fetchAEMEvents', async function(req) {
      // next events
      let orderedEvents = await apos.docs.getManager('event').find(
        req,
        { type: 'event' }
      )
        .sort({ startDate: 1 })
        .toArray();

      const today = new Date();
      req.data.orderedEvents = orderedEvents.filter(element => {
        if (element.endDate) {
          return moment(element.endDate).isSameOrAfter(today, 'day');
        } else {
          return moment(element.startDate).isSameOrAfter(today, 'day');
        }
      });

      // sorted by recently added
      req.data.eventsByMostRecent = await apos.docs.getManager('event').find(
        req,
        { type: 'event' }
      )
        .sort({ createdAt: -1 })
        .toArray();
    });
  },
};
