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
      label: 'Content Pieces',
      items: [
        'aem-education',
        'aem-articles',
        'aem-banner-ads',
        'aem-books',
        'aem-events',
        'aem-projects',
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
  ],

  /**
   * For some reason apostrophe does not respect ordering.
   * To order groups, put the first item of a group in this array.
   * The last item corresponds to the first menu.
   */
  order: [
    'apostrophe-workflow-locale-picker-modal',
    'aem-education',
    'aem-persons',
    'apostrophe-images',
    'apostrophe-users',
  ],
};
