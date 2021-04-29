const LinkableTypes = require('../../constants/linkable-types.json');


module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Link',
  addFields: [
    {
      label: 'Label',
      help: 'Label displayed on the button',
      name: 'label',
      type: 'string',
      required: true,
    },
    {
      label: 'Icon',
      name: 'icon',
      type: 'select',
      choices: [
        {
          label: 'None',
          value: null,
        },
        {
          label: 'Download',
          value: 'download',
        },
        {
          label: 'Patreon',
          value: 'patreon',
        },
        {
          label: 'PayPal',
          value: 'paypal',
        },
      ],
    },
    {
      label: 'Type',
      name: 'linkType',
      type: 'select',
      choices: [
        {
          label: 'Internal',
          value: 'internal',
          showFields: [ '_target' ],
        },
        {
          label: 'External',
          value: 'external',
          showFields: [ 'targetUrl' ],
        },
      ],
    },
    {
      label: 'Page, article, etc.',
      help: 'Content to which the button leads',
      name: '_target',
      type: 'joinByOne',
      withType: LinkableTypes,
      filters: {
        projection: {
          title: 1,
          attachment: 1,
          _url: 1,
        },
      },
      required: true,
    },
    {
      label: 'Target URL',
      name: 'targetUrl',
      type: 'string',
      required: true,
    },
  ],
};
