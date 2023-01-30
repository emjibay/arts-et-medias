module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Source',
  addFields: [
    // source type
    {
      label: 'Source Type',
      name: 'sourceType',
      type: 'select',
      required: true,
      choices: [
        {
          label: 'OpenGraph',
          value: 'openGraph',
          showFields: [],
        },
        {
          label: 'TwitterCard',
          value: 'twitterCard',
          showFields: [],
        },
        {
          label: 'Website Metadata',
          value: 'websiteMetadata',
          showFields: [],
        },
        {
          label: 'Custom',
          value: 'custom',
          showFields: [ 'source' ],
        },
      ],
    },
    {
      label: 'Source',
      name: 'source',
      type: 'string',
      required: true,
    },

    // translation
    {
      label: 'Is this translated',
      name: 'isTranslated',
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
          showFields: [ 'translationMethod' ],
        },
      ],
    },
    {
      label: 'Translation method',
      name: 'translationMethod',
      type: 'string',
      required: true,
    },
  ],
};
