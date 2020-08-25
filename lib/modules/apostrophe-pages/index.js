// This configures the apostrophe-pages module to add a "home" page type to the
// pages menu

module.exports = {
  types: [
    // common
    {
      name: 'indexTemplate',
      label: 'Index Template',
    },
    {
      name: 'contentTemplate',
      label: 'Content Template',
    },
    // articles
    {
      name: 'articlesIndex',
      label: 'Articles Index',
    },
    {
      name: 'aem-articles-page',
      label: 'Articles Page',
    },
    // projects
    {
      name: 'aem-projects-page',
      label: 'Projects Page',
    },
    // events
    {
      name: 'eventsIndex',
      label: 'Events Index',
    },
    {
      name: 'aem-events-page',
      label: 'Events Page',
    },
    // education
    {
      name: 'educationIndex',
      label: 'Education Index',
    },
    {
      name: 'aem-education-page',
      label: 'Education Page',
    },
    // organizations and people
    {
      name: 'organizationsIndex',
      label: 'Organizations Index',
    },
    {
      name: 'aem-organizations-page',
      label: 'Organization Page',
    },
    {
      name: 'aem-persons-page',
      label: 'People Page',
    },
    // media
    {
      name: 'mediaIndex',
      label: 'Media Index',
    },
    {
      name: 'aem-media-page',
      label: 'Media Page',
    },
    {
      name: 'aem-books-page',
      label: 'Books Page',
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
      orphan: true,
    },

    // FIXME: still saved as orphan in database
    // {
    //   title: 'Search',
    //   slug: '/search',
    //   type: 'apostrophe-search',
    //   label: 'Search',
    //   published: true,
    //   orphan: true,
    // },
  ],
};
