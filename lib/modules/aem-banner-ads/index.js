const copyField = require('../../utils/copy-field');

const DescriptionField = require('../../fields/rich-text-description.json');

const NotesField = copyField(
  DescriptionField,
  {
    label: 'Notes',
    name: 'campaignNotes',
    help: '',
    required: false,
  }
);

module.exports = {
  extend: 'apostrophe-pieces',
  name: 'banner',
  label: 'Banner Ad',
  pluralLabel: 'Banner Ads',
  addFields: [
    // campaign
    {
      label: 'Client',
      name: '_client',
      type: 'joinByOne',
      withType: 'sponsor',
      filters: {
        projection: {
          title: 1,
          _url: 1,
        },
      },
    },
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
      required: true,
    },
    {
      label: 'Target URL',
      help: '',
      name: 'targetUrl',
      type: 'string',
      required: true,
    },
    ...NotesField,

    // banner
    {
      label: 'Banner Type',
      help: 'Ensure to select the appropriate type, as it affects how the banner is displayed.',
      name: 'bannerType',
      type: 'select',
      required: true,
      choices: [
        {
          label: 'Medium Rectangle (600px × 500px)',
          value: 'medium-rectangle',
        },
        {
          label: 'Leaderboard (1280px × 158px)',
          value: 'leaderboard',
        },
        {
          label: 'Half Page (600px × 1200px)',
          value: 'half-page',
        },
        {
          label: 'Square (600px × 600px)',
          value: 'square',
        },
      ],
    },

    // banner image
    {
      label: 'Banner Image',
      help: 'Select an image that matches the dimensions chosen above.',
      name: 'bannerImage',
      type: 'singleton',
      widgetType: 'apostrophe-images',
      required: true,
      options: {
        limit: 1,
      },
    },
    {
      label: 'Alt Text',
      htmlHelp: `<p>Provide a text alternative so that it can be changed into other forms people need, such as large print, braille, speech, symbols or simpler language.</p>
      <p>Read <a href="https://www.deque.com/blog/great-alt-text-introduction/">How to Design Great Alt Text: An Introduction</a> for more details on the rationale and some examples.</p>`,
      name: 'altText',
      type: 'string',
      required: true,
    },

    // mobile
    {
      label: 'Does Banner Show At Mobile Breakpoint',
      name: 'isVisibleAtMobile',
      type: 'select',
      required: true,
      choices: [
        {
          label: 'No',
          value: false,
        },
        {
          label: 'Yes',
          value: true,
          showFields: [
            'mobileBannerType',
            'mobileBannerImage',
          ],
        },
      ],
    },
    {
      label: 'Mobile Banner Type',
      help: 'Ensure to select the appropriate type, as it affects how the banner is displayed.',
      name: 'mobileBannerType',
      type: 'select',
      required: true,
      choices: [
        {
          label: 'Mobile Leaderboard (640px × 100px)',
          value: 'mobile-leaderboard',
        },
        {
          label: 'Medium Rectangle (600px × 500px)',
          value: 'mobile-medium-rectangle',
        },
        {
          label: 'Square (600px × 600px)',
          value: 'mobile-square',
        },
      ],
    },
    {
      label: 'Mobile Banner Image',
      help: 'Select an image that matches the dimensions chosen above.',
      name: 'mobileBannerImage',
      type: 'singleton',
      widgetType: 'apostrophe-images',
      required: true,
      options: {
        limit: 1,
      },
    },
  ],
  arrangeFields: [
    {
      label: 'Campaign',
      name: 'basics',
      fields: [
        'title',
        '_client',
        'startDate',
        'endDate',
        'targetUrl',
        'campaignNotes',
      ],
    },
    {
      label: 'Banner Image',
      name: 'bannerImage',
      fields: [
        'bannerType',
        'bannerImage',
        'altText',
      ],
    },
    {
      label: 'Mobile',
      name: 'mobile',
      fields: [
        'isVisibleAtMobile',
        'mobileBannerType',
        'mobileBannerImage',
      ],
    },
    {
      label: 'Meta',
      name: 'meta',
      fields: [
        'tags',
        'slug',
        'published',
        'trash',
      ],
    },
  ],
};
