/* global apos */

apos.define('apostrophe-browser-utils', {
  construct: function(self, options) {
    const superSlugify = self.slugify;
    self.slugify = function(s, options) {
      const slug = superSlugify(s, options);
      const sansAccents = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return sansAccents;
    };
  },
});
