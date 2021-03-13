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
    // subjects
    {
      name: 'discoverPage',
      label: 'Discover Page',
    },
    {
      name: 'visitPage',
      label: 'Visit Page',
    },
    {
      name: 'readPage',
      label: 'Read Page',
    },
    {
      name: 'learnPage',
      label: 'Learn Page',
    },
    // slack signup form
    {
      name: 'slackSignUpForm',
      label: 'Slack Sign Up Form',
    },
    // admin - analytics
    {
      name: 'analyticsDashboardTemplate',
      label: 'Analytics Dashboard Template',
    },
    {
      name: 'analyticsDownloadsTemplate',
      label: 'Analytics Downloads Template',
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
      name: 'eventsArchive',
      label: 'Events Archive',
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

    // FIXME: still saved as orphan in database (#81)
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
