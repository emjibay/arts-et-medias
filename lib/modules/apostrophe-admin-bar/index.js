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
      ]
    },
    {
      label: 'Files',
      items: [
        'apostrophe-images',
        'apostrophe-files',
      ]
    },
    {
      label: 'Content Pieces',
      items: [
        'aem-articles',
        'aem-events',
        'aem-projects',
        'aem-media',
        'aem-books',
        'aem-education',
      ]
    },
    {
      label: 'Organizations and People',
      items: [
        'aem-organizations',
        'aem-persons',
      ]
    },
  ],

  /**
   * For some reason apostrophe does not respect ordering.
   * To order groups, put the first item of a group in this array.
   * The last item corresponds to the first menu.
   */
  order: [
    'aem-articles',
    'aem-organizations',
    'apostrophe-images',
    'apostrophe-pages',
  ]
};
