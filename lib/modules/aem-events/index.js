const moment = require('moment');

const log = require('../../utils/log');

const CityField = require('../../fields/city.json');
const CountryCodeField = require('../../fields/country-code.json');
const DescriptionField = require('../../fields/rich-text-description.json');
const HeroImageField = require('../../fields/hero-image.json');
const NameField = require('../../fields/name.json');
const RelatedOrganizations = require('../../fields/related-organizations.json');
const RelatedPeople = require('../../fields/related-people.json');
const RelatedProjects = require('../../fields/related-projects.json');
const ShortDescriptionField = require('../../fields/optional-short-description.json');
const WebsiteField = require('../../fields/website.json');


const type = 'event';


module.exports = {
  extend: 'apostrophe-pieces',
  name: type,
  label: 'Event',
  pluralLabel: 'Events',
  addFields: [
    // basics
    {
      label: 'Is event online only?',
      htmlHelp: '<p>Set this as "Yes" if the event is <u>only</u> offered online.</p><p>Otherwise, you <u>must</u> provide a city and country.</p>',
      name: 'isOnlyOnline',
      type: 'select',
      required: true,
      choices: [
        {
          label: 'No',
          value: false,
          showFields: [
            'city',
            'country',
          ],
        },
        {
          label: 'Yes',
          value: true,
          showFields: [],
        },
      ],
    },

    // calendar
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

    // hero image
    {
      label: 'Use Remote Image',
      name: 'isUsingRemoteImage',
      type: 'checkbox',
    },
    {
      label: 'Image Location',
      help: 'The full URL to the image.',
      name: 'remoteImageLocation',
      type: 'string',
      required: true,
    },
    {
      label: 'Image Alt Text',
      name: 'remoteImageAltText',
      type: 'string',
    },
    {
      label: 'Image Caption',
      name: 'remoteImageCaption',
      type: 'string',
      required: true,
    },
    {
      label: 'Image Credit',
      name: 'remoteImageCredit',
      type: 'string',
    },
    {
      label: 'Image Source',
      name: 'remoteImageSource',
      type: 'string',
    },
    {
      label: 'Use Remote Image',
      name: 'isUsingRemoteImage',
      type: 'boolean',
      choices: [
        {
          value: true,
          showFields: [
            'remoteImageLocation',
            'remoteImageAltText',
            'remoteImageCaption',
            'remoteImageCredit',
            'remoteImageSource',
          ],
        },
        {
          value: false,
          showFields: [ 'heroImage' ],
        },
      ],
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
    ...RelatedProjects,
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
        'isOnlyOnline',
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
        'isUsingRemoteImage',
        'heroImage',
        'remoteImageLocation',
        'remoteImageAltText',
        'remoteImageCaption',
        'remoteImageCredit',
        'remoteImageSource',
      ],
    },

    // related content
    {
      label: 'Related Content',
      name: 'relatedContent',
      fields: [
        '_relatedProjects',
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
  return response.reverse();
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
