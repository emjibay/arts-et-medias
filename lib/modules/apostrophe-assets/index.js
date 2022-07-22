// This configures the apostrophe-assets module to push a 'site.less'
// stylesheet by default, and to use jQuery 3.x

module.exports = {
  jQuery: 3,
  stylesheets: [
    {
      name: 'site',
      minify: true,
    },
  ],
  scripts: [
    {
      name: 'site',
      minify: true,
    },
    {
      name: 'focus-visible.min',
    },
  ],
};
