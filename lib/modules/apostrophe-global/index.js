const createBannerAdField = (label, name) => {
  return {
    label,
    name,
    type: 'singleton',
    widgetType: 'aem-banner-ads',
    limit: 1,
    filters: {
      projection: {
        bannerType: 1,
        targetUrl: 1,
        startDate: 1,
        endDate: 1,
        altText: 1,
        bannerImage: 1,
        mobileBannerImage: 1,
        isVisibleAtMobile: 1,
      },
    },
  };
};


module.exports = {
  addFields: [
    // global
    createBannerAdField(
      'Sidebar Banner 1',
      'globalSidebarBanners1'
    ),
    createBannerAdField(
      'Sidebar Banner 2',
      'globalSidebarBanners2'
    ),
    createBannerAdField(
      'Sidebar Banner 3',
      'globalSidebarBanners3'
    ),
    // home page
    createBannerAdField(
      'Top Leaderboard',
      'homeTopLeaderboard'
    ),
    createBannerAdField(
      'Leaderboard 2',
      'homeLeaderboard2'
    ),
    createBannerAdField(
      'Leaderboard 3',
      'homeLeaderboard3'
    ),
    createBannerAdField(
      'Leaderboard 4',
      'homeLeaderboard4'
    ),
    createBannerAdField(
      'Leaderboard 5',
      'homeLeaderboard5'
    ),
    createBannerAdField(
      'Sidebar Banner 1',
      'homeSidebarBanner1'
    ),
    createBannerAdField(
      'Sidebar Banner 2',
      'homeSidebarBanner2'
    ),
    // articles
    createBannerAdField(
      'Main Leaderboard',
      'articlesLeaderboard'
    ),
    createBannerAdField(
      'Secondary Leaderboard',
      'articlesMinorLeaderboard'
    ),
    createBannerAdField(
      'Sidebar Banner 1',
      'articlesSidebarBanners1'
    ),
    createBannerAdField(
      'Sidebar Banner 2',
      'articlesSidebarBanners2'
    ),
    // books
    createBannerAdField(
      'Main Leaderboard',
      'booksLeaderboard'
    ),
    createBannerAdField(
      'Secondary Leaderboard',
      'booksMinorLeaderboard'
    ),
    createBannerAdField(
      'Sidebar Banner 1',
      'booksSidebarBanners1'
    ),
    createBannerAdField(
      'Sidebar Banner 2',
      'booksSidebarBanners2'
    ),
  ],
  arrangeFields: [
    // global
    {
      label: 'Global Sidebar',
      name: 'global',
      fields: [
        'globalSidebarBanners1',
        'globalSidebarBanners2',
        'globalSidebarBanners3',
      ],
    },
    // home page
    {
      label: 'Home Page',
      name: 'homePage',
      fields: [
        'homeTopLeaderboard',
        'homeLeaderboard2',
        'homeLeaderboard3',
        'homeLeaderboard4',
        'homeLeaderboard5',
        'homeSidebarBanner1',
        'homeSidebarBanner2',
      ],
    },
    // articles
    {
      label: 'Articles',
      name: 'articles',
      fields: [
        'articlesLeaderboard',
        'articlesMinorLeaderboard',
        'articlesSidebarBanners1',
        'articlesSidebarBanners2',
      ],
    },
    // books
    {
      label: 'Books',
      name: 'books',
      fields: [
        'booksLeaderboard',
        'booksMinorLeaderboard',
        'booksSidebarBanners1',
        'booksSidebarBanners2',
      ],
    },
  ],
};
