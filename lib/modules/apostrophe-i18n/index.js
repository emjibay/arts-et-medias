// options are passed to https://www.npmjs.com/package/i18n
module.exports = {
  beforeConstruct: function(self, options) {
    options.locales = ['en', 'fr', ];
    options.defaultLocale = 'en';
    options.updateFiles = false;
    options.objectNotation = '|';
    options.autoReload = false;
    options.cookie = null;
  },
  expressMiddleware: [
    function setTheLocaleBecauseI18NIsStupidAndDoesntCheckReq(req, res, next) {
      res.locale = req.locale;
      next();
    },
  ],
};
