module.exports = {
  groups: [
    {
      label: 'Admin',
      items: [
        'apostrophe-users',
        'apostrophe-groups',
        'apostrophe-workflow-manage-modal',
        'apostrophe-global',
        'apostrophe-pages',
        'apostrophe-tags',
      ],
    },
    {
      label: 'Files',
      items: [
        'apostrophe-images',
        'apostrophe-files',
      ],
    },
    {
      label: 'People and Organizations',
      items: [
        'aem-persons',
        'aem-organizations',
        'aem-media',
      ],
    },
    {
      label: 'Content Pieces',
      items: [
        'aem-education',
        'aem-articles',
        'aem-books',
        'aem-events',
        'aem-projects',
      ],
    },
    {
      label: 'Sponsored Content',
      items: [
        'aem-sponsors',
        'aem-banner-ads',
      ],
    },
  ],

  /**
   * For some reason apostrophe does not respect ordering.
   * To order groups, put the first item of a group in this array.
   * The last item corresponds to the first menu.
   */
  order: [
    'apostrophe-workflow-locale-picker-modal',
    'aem-sponsors',
    'aem-education',
    'aem-persons',
    'apostrophe-images',
    'apostrophe-users',
  ],
};
