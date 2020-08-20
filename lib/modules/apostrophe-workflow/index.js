const acceptLanguage = require('accept-language');

const availableLocales = [
  {
    name: 'en',
    label: 'English'
  },
  {
    name: 'fr',
    label: 'Français'
  }
];

const languageParser = acceptLanguage.create();
languageParser.languages(availableLocales.map(l => l.name));

module.exports = {
  alias: 'workflow',
  prefixes: true, // Use prefixes for slug, such as /en/slug or /fr/slug
  exportAfterCommit: false,
  locales: [
    {
      name: 'default',
      label: 'Default',
      private: true,
      children: availableLocales
    }
  ],

  defaultLocale: 'en',
  construct(self, options) {
    self.guessLocale = function guessLocale(req) {

      let locale;
      try {
        locale = languageParser.get(req.headers['accept-language']);
      } catch (err) {
        self.apos.utils.error(err);
        locale = self.defaultLocale;
      }

      req.res.locale = req.locale = locale;
    };
  }
};
