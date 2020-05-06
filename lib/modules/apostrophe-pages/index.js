// This configures the apostrophe-pages module to add a "home" page type to the
// pages menu

module.exports = {
  types: [
    // common
    {
      name: 'indexTemplate',
      label: 'Index Template'
    },
    {
      name: 'contentTemplate',
      label: 'Content Template'
    },
    // articles
    {
      name: 'aem-articles-page',
      label: 'Articles'
    },
    // projects
    {
      name: 'aem-projects-page',
      label: 'Projects'
    },
    // events
    {
      name: 'eventsIndex',
      label: 'Events Index'
    },
    {
      name: 'aem-events-page',
      label: 'Events'
    },
    // education
    {
      name: 'educationIndex',
      label: 'Education Index'
    },
    {
      name: 'aem-education-page',
      label: 'Education, programs, or workshops'
    },
    // institutions and people
    {
      name: 'aem-galleries-page',
      label: 'Galleries or Institutions'
    },
    {
      name: 'aem-persons-page',
      label: 'People'
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
