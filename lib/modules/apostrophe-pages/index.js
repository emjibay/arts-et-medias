// This configures the apostrophe-pages module to add a "home" page type to the
// pages menu

module.exports = {
  types: [
    {
      name: 'contentTemplate',
      label: 'Content Template'
    },
    {
      name: 'aem-persons-page',
      label: 'People'
    },
    {
      name: 'aem-galleries-page',
      label: 'Galleries or Institutions'
    },
    {
      name: 'aem-events-page',
      label: 'Events'
    },
    {
      name: 'aem-education-page',
      label: 'Education, programs, or workshops'
    },
  ],

  // parked pages
  park: [
    {
      title: 'Home',
      slug: '/',
      type: 'home',
      label: 'Home',
      published: true,
      orphan: true
    },
  ]
};
