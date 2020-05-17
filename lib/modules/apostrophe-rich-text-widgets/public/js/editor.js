apos.define('apostrophe-rich-text-widgets-editor', {
  construct: function (self, options) {

    self.beforeCkeditorInline = function () {
      self.config.extraPlugins = '';

      // Allow super/sub script which are disabled by default.
      self.config.removeButtons = '';

      // Context menu is the worst!
      self.config.removePlugins = 'contextmenu,tabletools';
    };
  }

});
