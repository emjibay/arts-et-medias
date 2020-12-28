module.exports = {
  groups: [
    {
      label: 'Admin',
      items: [
        'apostrophe-pages',
        'apostrophe-global',
        'apostrophe-tags',
        'apostrophe-workflow-manage-modal',
        'apostrophe-users',
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
        'aem-media',
        'aem-projects',
      ],
    },
    {
      label: 'Organizations and People',
      items: [
        'aem-organizations',
        'aem-persons',
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
    'aem-organizations',
    'apostrophe-images',
    'apostrophe-pages',
  ],
};
