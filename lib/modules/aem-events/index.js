const moment = require('moment');

const log = require('../../utils/log');

const CityField = require('../../fields/city.json');
const CountryCodeField = require('../../fields/country-code.json');
const DescriptionField = require('../../fields/rich-text-description.json');
const HeroImageField = require('../../fields/hero-image.json');
const NameField = require('../../fields/name.json');
const RelatedOrganizations = require('../../fields/related-organizations.json');
const RelatedPeople = require('../../fields/related-people.json');
const ShortDescriptionField = require('../../fields/optional-short-description.json');
const WebsiteField = require('../../fields/website.json');


const type = 'event';


module.exports = {
  extend: 'apostrophe-pieces',
  name: type,
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

    // reverse relations
    {
      name: '_articles',
      reverseOf: '_relatedEvents',
      type: 'joinByArrayReverse',
      withType: 'article',
      filters: {
        projection: {
          '_url': 1,
          'title': 1,
        },
      },
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
    // basics
    {
      label: 'Basics',
      name: 'basics',
      fields: [
        'title',
        'city',
        'country',
        'website',
        'description',
      ],
    },

    // calendar
    {
      label: 'Calendar',
      name: 'calendar',
      fields: [
        'startDate',
        'endDate',
      ],
    },

    // metadata
    {
      label: 'Metadata',
      name: 'meta',
      fields: [
        'shortDescription',
        'tags',
      ],
    },

    // hero image
    {
      label: 'Hero Image',
      name: 'heroImage',
      fields: [
        'heroImage',
      ],
    },

    // related content
    {
      label: 'Related Content',
      name: 'relatedContent',
      fields: [
        '_relatedPeople',
        '_relatedOrganizations',
      ],
    },

    // meta
    {
      label: 'CMS Properties',
      name: 'aposProps',
      fields: [
        'slug',
        'published',
        'trash',
      ],
    },
  ],

  construct: (self, options) => {
    const { apos } = self;

    self.on('apostrophe-pages:beforeSend', 'fetchAEMEvents', async function(req) {
      // future events
      const eventsByStartDate = await apos.docs.getManager(type)
        .find(req, { type })
        .sort({ startDate: 1 })
        .toArray();

      req.data.pastEvents = getOnlyPastEvents(eventsByStartDate);
      req.data.ongoingEvents = getOngoingEvents(eventsByStartDate);
      req.data.ongoingAndFutureEvents = getOngoingAndFutureEvents(eventsByStartDate);
      req.data.futureEvents = getOnlyFutureEvents(eventsByStartDate);

      // sorted by recently added
      const eventsByCreatedAt = await apos.docs.getManager(type)
        .find(req, { type })
        .sort({ createdAt: -1 })
        .toArray();
      req.data.eventsByMostRecent = getOnlyFutureEvents(eventsByCreatedAt);
    });
  },
};


function getOnlyFutureEvents(events) {
  const response = [];
  const today = new Date();
  events.forEach(event => {
    if (event.startDate) {
      const isSameOrAfter = isSameDayOrAfter(event.startDate, today);
      if (isSameOrAfter) {
        response.push(event);
      }
    } else {
      log.critical(
        `Event "${event.title}" (${event._id}) has no "startDate" property.`
      );
    }
  });
  return response;
}

function getOnlyPastEvents(events) {
  const response = [];
  const today = new Date();
  events.forEach(event => {
    if (event.endDate) {
      const isBefore = moment(event.endDate).isBefore(today, 'day');
      if (isBefore) {
        response.push(event);
      }
    } else {
      const isBefore = moment(event.startDate).isBefore(today, 'day');
      if (isBefore) {
        response.push(event);
      }
    }
  });
  return response;
}

function getOngoingEvents(events) {
  const response = [];
  const today = new Date();
  events.forEach(event => {
    if (event.endDate) {
      const isSameOrAfter = isSameDayOrAfter(event.endDate, today);
      if (isSameOrAfter) {
        response.push(event);
      }
    }
  });
  return response;
}

function getOngoingAndFutureEvents(events) {
  const response = [];
  const today = new Date();
  events.forEach(event => {
    if (event.endDate) {
      const isSameOrAfter = isSameDayOrAfter(event.endDate, today);
      if (isSameOrAfter) {
        response.push(event);
      }
    } else {
      const isSameOrAfter = isSameDayOrAfter(event.startDate, today);
      if (isSameOrAfter) {
        response.push(event);
      }
    }
  });
  return response;
}

function isSameDayOrAfter(dateA, dateB) {
  if (!dateA || !dateB) {
    return false;
  }
  return moment(dateA).isSameOrAfter(dateB, 'day');
}
