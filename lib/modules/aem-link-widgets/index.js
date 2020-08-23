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
      label: 'Page, article, etc.',
      help: 'Content to which the button leads',
      name: '_target',
      type: 'joinByOne',
      withType: LinkableTypes,
      filters: {
        permission: false,
        projection: {
          title: 1,
          _url: 1,
        },
      },
    },
  ],
};
