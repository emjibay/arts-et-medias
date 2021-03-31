const _ = require('lodash');
const isProd = require('../../utils/is-prod');

// This configures the apostrophe-assets module to push a 'site.less'
// stylesheet by default, and to use jQuery 3.x

module.exports = {
  jQuery: 3,

  minify: isProd(),

  stylesheets: [
    {
      name: 'site',
      import: {
        inline: true,
      },
    },
    {
      name: 'user',
      when: 'user',
      import: {
        inline: true,
      },
    },
  ],

  scripts: [
    { name: 'vendor' },
    { name: 'site' },
  ],

  construct: function(self, options) {
    self.scriptsHelper = function(when) {
      const scriptAttributes = when !== 'user' ? 'defer' : '';

      let result = `<script>
                  window.apos = ${JSON.stringify(self.getCoreAposProperties(when))};
                    </script>`;

      if (self.options.minify) {
        const unminifiable = self.filterAssets(self.pushed['scripts'], when, false);
        result += scriptTags(unminifiable);
        result += scriptWithSrc(self.assetUrl(`/apos-minified/${when}-${self.generation}.js`)) + '\n';
        return self.apos.templates.safe(result);

      } else {
        const scriptsWhen = self.filterAssets(self.pushed['scripts'], when);
        result += scriptTags(scriptsWhen);
        return self.apos.templates.safe(result);
      }

      function scriptWithSrc(src) {
        return `<script ${scriptAttributes} src="${src}"></script>`;
      }

      function scriptTags(scripts) {
        return _.map(scripts, script => scriptWithSrc(self.assetUrl(script.web)))
          .join('\n');
      }
    };
  },
};
